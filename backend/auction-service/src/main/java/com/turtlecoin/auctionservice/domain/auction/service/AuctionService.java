package com.turtlecoin.auctionservice.domain.auction.service;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.turtlecoin.auctionservice.domain.auction.dto.AuctionFilterResponseDTO;
import com.turtlecoin.auctionservice.domain.auction.dto.AuctionResponseDTO;
import com.turtlecoin.auctionservice.domain.auction.dto.RegisterAuctionDTO;
import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionPhoto;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import com.turtlecoin.auctionservice.domain.auction.entity.QAuction;
import com.turtlecoin.auctionservice.domain.auction.facade.RedissonLockFacade;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.domain.s3.service.ImageUploadService;
import com.turtlecoin.auctionservice.feign.dto.TurtleResponseDTO;
import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import com.turtlecoin.auctionservice.feign.MainClient;
import com.turtlecoin.auctionservice.feign.dto.UserResponseDTO;
import com.turtlecoin.auctionservice.global.exception.*;
import com.turtlecoin.auctionservice.global.response.ResponseVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpConnectException;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuctionService {

    private final RedisTemplate<String, Object> redisTemplate;

    private final AuctionRepository auctionRepository;
    private final ImageUploadService imageUploadService;  // ImageUploadService도 주입합니다.
    private final MainClient mainClient;
    private final JPAQueryFactory queryFactory;
    private final RedissonLockFacade redissonLockFacade;
    private final SchedulingService schedulingService;
    private final BidService bidService;
    private final SseService sseService;

    // 경매 등록
    @Transactional
    public ResponseEntity<?> registerAuction(RegisterAuctionDTO registerAuctionDTO, List<MultipartFile> images) {
        List<AuctionPhoto> uploadedPhotos = new ArrayList<>();
        try {
            log.info("경매 등록 시작 - 사용자 ID: {}, 거북이 ID: {}", registerAuctionDTO.getUserId(), registerAuctionDTO.getTurtleId());

            // 필수 입력 값 누락 시 에러 던져주기
            if (registerAuctionDTO.getTurtleId() == null || registerAuctionDTO.getSellerAddress() == null || registerAuctionDTO.getTitle() == null || registerAuctionDTO.getMinBid() == null) {
                throw new IllegalArgumentException("필수 필드가 누락됐습니다.");
            }

            validateUserOwnsTurtle(registerAuctionDTO.getUserId(), registerAuctionDTO.getTurtleId());
            validateTurtleNotAlreadyRegistered(registerAuctionDTO.getTurtleId());

            // 경매 저장
            Auction auction = auctionRepository.save(registerAuctionDTO.toEntity());

            // 동적 스케줄링 수행
            Consumer<Long> startAuction = bidService::startAuction;
            schedulingService.scheduleTask(auction.getId(), startAuction, auction.getStartTime());

            // 이미지 업로드 처리
            if (images != null && !images.isEmpty()) {
                uploadedPhotos = uploadImages(images, auction);  // 이미지 업로드
                auction.getAuctionPhotos().addAll(uploadedPhotos);  // 업로드된 이미지 경매와 연결
            }

            return new ResponseEntity<>(ResponseVO.success("경매가 성공적으로 등록됐습니다."), HttpStatus.OK);


        } catch (TurtleAlreadyRegisteredException e) {
            return new ResponseEntity<>(ResponseVO.failure("409", "이미 등록된 개체입니다."), HttpStatus.CONFLICT);

        } catch (IOException e) {
            log.info("IOException 발생");
            return new ResponseEntity<>(ResponseVO.failure("400", "경매 등록에 실패했습니다. " + e.getMessage()), HttpStatus.BAD_REQUEST);

        } catch (NumberFormatException e) {
            // 숫자 형식이 잘못된 경우 예외 처리
            deleteUploadedImages(uploadedPhotos);
            return new ResponseEntity<>(ResponseVO.failure("400", "잘못된 형식의 입력값이 있습니다."), HttpStatus.BAD_REQUEST);

        } catch (IllegalArgumentException e) {
            // 기타 잘못된 인자 처리
            deleteUploadedImages(uploadedPhotos);
            return new ResponseEntity<>(ResponseVO.failure("400", "필수 필드가 누락되었습니다."), HttpStatus.BAD_REQUEST);
        } catch (MultipartException e) {
            // Multipart 관련 예외 처리
            log.error("MultipartException 발생: {}", e.getMessage());
            deleteUploadedImages(uploadedPhotos);
            return new ResponseEntity<>(ResponseVO.failure("400", "잘못된 요청입니다. multipart/form-data 형식으로 요청해주세요."), HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            log.info("기타 오류 발생");
            deleteUploadedImages(uploadedPhotos);
            return new ResponseEntity<>(ResponseVO.failure("500", "서버 내부 오류가 발생했습니다. " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 이미지 업로드 처리 메서드
    private List<AuctionPhoto> uploadImages(List<MultipartFile> images, Auction auction) throws IOException {
        List<AuctionPhoto> photos = new ArrayList<>();
        for (MultipartFile image : images) {
            String imagePath = imageUploadService.upload(image, "auctionImages");
            photos.add(AuctionPhoto.builder().imageAddress(imagePath).auction(auction).build());
        }
        return photos;
    }

    // 사용자가 소유한 거북이인지 검증 메서드
    private void validateUserOwnsTurtle(Long userId, Long turtleId) {
        List<TurtleResponseDTO> userTurtles = mainClient.getTurtlesByUserId(userId);
        if (userTurtles.isEmpty()) {
            throw new UserNotFoundException("사용자를 찾을 수 없습니다: " + userId);
        }

        boolean isUserTurtle = userTurtles.stream().anyMatch(turtle -> turtle.getId().equals(turtleId));
        if (!isUserTurtle) {
            throw new TurtleNotFoundException("해당 거북이는 사용자가 소유한 거북이가 아닙니다.");
        }
    }

    private void validateTurtleNotAlreadyRegistered(Long turtleId) {
        if (auctionRepository.countInProgressAuctionByTurtleId(AuctionProgress.BEFORE_AUCTION, AuctionProgress.DURING_AUCTION, turtleId) > 0) {
            throw new TurtleAlreadyRegisteredException("이미 등록된 거북이는 등록할 수 없습니다.");
        }
    }

    // 거북이 정보를 가져와서 RegisterAuctionDTO에 설정하는 메서드
    private RegisterAuctionDTO updateAuctionWithTurtleInfo(RegisterAuctionDTO registerAuctionDTO) {
        TurtleResponseDTO turtleInfo = mainClient.getTurtle(registerAuctionDTO.getTurtleId());

        return RegisterAuctionDTO.builder()
                .turtleId(registerAuctionDTO.getTurtleId())
                .userId(registerAuctionDTO.getUserId())
                .startTime(registerAuctionDTO.getStartTime())
                .minBid(registerAuctionDTO.getMinBid())
                .content(registerAuctionDTO.getContent())
                .title(registerAuctionDTO.getTitle())
                .weight(turtleInfo.getWeight())  // 거북이 무게 설정
                .gender(turtleInfo.getGender())  // 거북이 성별 설정
                .build();
    }

    // 경매 저장 처리 메서드
    private Auction saveAuction(RegisterAuctionDTO registerAuctionDTO) {
        Auction auction = registerAuctionDTO.toEntity();
        log.info("auction: {}", auction);
        log.info("빌더를 이용해서 저장 성공");
        return auctionRepository.save(auction);
    }

    // 업로드된 이미지 삭제 메서드
    public void deleteUploadedImages(List<AuctionPhoto> auctionPhotos) {
        for (AuctionPhoto photo : auctionPhotos) {
            imageUploadService.deleteS3(photo.getImageAddress());
        }
    }

    // 경매 ID로 경매 조회
    public ResponseEntity<?> getAuctionById(Long auctionId) {
        try {
            Auction auction = auctionRepository.findById(auctionId)
                    .orElseThrow(() -> new AuctionNotFoundException("경매를 찾을 수 없습니다: " + auctionId));

            TurtleResponseDTO turtle = mainClient.getTurtle(auctionId);
            UserResponseDTO user = mainClient.getUserById(auction.getUserId());

            AuctionResponseDTO data = AuctionResponseDTO.from(auction, turtle, user);
            return new ResponseEntity<>(ResponseVO.success("경매가 정상적으로 조회되었습니다.", "auction", data), HttpStatus.OK);
        } catch (AuctionNotFoundException e) {
            return new ResponseEntity<>(ResponseVO.failure("400", e.getMessage()), HttpStatus.BAD_REQUEST);

        } catch(Exception e){
            return new ResponseEntity<>(ResponseVO.failure("500","경매 조회 과정 중에 서버 에러가 발생하였습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 경매 필터링 후 조회
    public ResponseEntity<?> getFilteredAuctions(Gender gender, Double minSize, Double maxSize, Double minPrice, Double maxPrice, AuctionProgress progress, int page) {
        try {
            QAuction auction = QAuction.auction;

            BooleanBuilder whereClause = new BooleanBuilder();

            // 가격 필터 (minPrice ~ maxPrice)
            if (minPrice != null) {
                if (maxPrice != null) {
                    whereClause.and(auction.minBid.between(minPrice, maxPrice));
                } else {
                    whereClause.and(auction.minBid.goe(minPrice));
                }
            } else if (maxPrice != null) {
                whereClause.and(auction.minBid.loe(maxPrice));
            }

            // 경매 진행 상태 필터
            if (progress != null) {
                whereClause.and(auction.auctionProgress.eq(progress));
            }

            // main-service에서 필터링 엔드포인트 열어둘 것
            List<TurtleResponseDTO> filteredTurtles = mainClient.getFilteredTurtles(gender, minSize, maxSize);

            long totalAuctions = queryFactory.selectFrom(auction)
                    .where(whereClause.and(auction.turtleId.in(
                            filteredTurtles.stream().map(TurtleResponseDTO::getId).toList())))
                    .fetch()
                    .size();

            List<Auction> auctions = queryFactory.selectFrom(auction)
                    .where(whereClause.and(auction.turtleId.in(
                            filteredTurtles.stream().map(TurtleResponseDTO::getId).toList())))
                    .offset(page * 20L)
                    .limit(20)
                    .fetch();

            int totalPages = (int) Math.ceil((double) totalAuctions / 20);

            Map<String, Object> data = new HashMap<>();
            data.put("auctions", auctions);
            data.put("total_pages", totalPages);

            return new ResponseEntity<>(ResponseVO.success("경매가 성공적으로 조회 되었습니다.", "data", data), HttpStatus.OK);
        } catch (NumberFormatException e) {
            // 숫자 형식이 잘못된 경우 예외 처리
            return new ResponseEntity<>(ResponseVO.failure("400", "잘못된 형식의 입력값이 있습니다."), HttpStatus.BAD_REQUEST);

        } catch (IllegalArgumentException e) {
            // 기타 잘못된 인자 처리
            return new ResponseEntity<>(ResponseVO.failure("400", "잘못된 파라미터입니다."), HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            // 기타 예외 처리 (서버 오류)
            e.printStackTrace();  // 로그 출력
            return new ResponseEntity<>(ResponseVO.failure("500", "서버 에러가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    // 거북이 정보를 받아와서 경매정보를 DTO로 변환
//    // 수정, 테스트 필요
    public AuctionResponseDTO convertToDTO(Auction auction) {
        log.info("Turtle ID: {}", auction.getTurtleId());
        TurtleResponseDTO turtleInfo = mainClient.getTurtle(auction.getTurtleId());

        if (turtleInfo == null) {
            throw new TurtleNotFoundException("Main-service에서 거북이를 가져올 수 없습니다.");
        }
        UserResponseDTO userInfo = mainClient.getUserById(auction.getUserId());
        if (userInfo == null) {
            throw new UserNotFoundException("Main-service에서 유저 정보를 가져올 수 없습니다.");
        }

        log.info("Turtle info retrieved: {}", turtleInfo);
        log.info("User info retrieved: {}", userInfo);
        return AuctionResponseDTO.from(auction, turtleInfo, userInfo);
    }

    public void processBid(Long auctionId, Long userId, Double newBidAmount) {
        redissonLockFacade.updateBidWithLock(auctionId, userId, newBidAmount);
    }

    // 서버 재시작시 스케줄링 다시 등록하기
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void scheduleReload(){
        List<Auction> acutions = auctionRepository.findByAuctionProgress(AuctionProgress.BEFORE_AUCTION);

        for(Auction auction : acutions){
            if(auction.getStartTime().isAfter(LocalDateTime.now())){
                Consumer<Long> startAuction = bidService::startAuction;
                schedulingService.scheduleTask(auction.getId(), startAuction, auction.getStartTime());
            }
        }
    }
}