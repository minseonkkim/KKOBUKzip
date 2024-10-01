package com.turtlecoin.auctionservice.domain.auction.service;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;

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

    // 경매 등록
    @Transactional
    public Auction registerAuction(RegisterAuctionDTO registerAuctionDTO, List<MultipartFile> images) throws IOException {
        log.info("경매 등록 시작 - 사용자 ID: {}, 거북이 ID: {}", registerAuctionDTO.getUserId(), registerAuctionDTO.getTurtleId());

        validateUserOwnsTurtle(registerAuctionDTO.getUserId(), registerAuctionDTO.getTurtleId());
        validateTurtleNotAlreadyRegistered(registerAuctionDTO.getTurtleId());

        // 경매 저장
        Auction auction = auctionRepository.save(registerAuctionDTO.toEntity());

        // 이미지 업로드 처리
        List<AuctionPhoto> uploadedPhotos = new ArrayList<>();
        try {
            if (images != null && !images.isEmpty()) {
                uploadedPhotos = uploadImages(images, auction);  // 이미지 업로드
                auction.getAuctionPhotos().addAll(uploadedPhotos);  // 업로드된 이미지 경매와 연결
            }
        } catch (Exception e) {
            // 예외 발생 시 업로드된 이미지 삭제
            // 예외 발생 추가
            deleteUploadedImages(uploadedPhotos);
            throw new IOException("이미지 업로드 중 오류가 발생했습니다.", e);
        }

        return auction;
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
        if (auctionRepository.existsByTurtleId(turtleId)) {
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
    public AuctionResponseDTO getAuctionById(Long auctionId) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new AuctionNotFoundException("경매를 찾을 수 없습니다: " + auctionId));

        log.info("경매 ID로 경매 조회");

        TurtleResponseDTO turtle = mainClient.getTurtle(auctionId);
        UserResponseDTO user = mainClient.getUserById(auction.getUserId());

        // 경매 정보를 빌더 패턴을 사용해 DTO로 변환
        return AuctionResponseDTO.from(auction, turtle, user);
    }

    // 경매 필터링 후 조회
    public List<Auction> getFilteredAuctions(Gender gender, Double minSize, Double maxSize, Double minPrice, Double maxPrice, AuctionProgress progress, int page) {
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

        return queryFactory.selectFrom(auction)
                .where(whereClause.and(auction.turtleId.in(
                        filteredTurtles.stream().map(TurtleResponseDTO::getId).toList())))
                .offset((page-1L) * 10)
                .limit(10)
                .fetch();
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

    public void endAuction(Long auctionId) {
        // 상태 종료로 변경
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new AuctionNotFoundException("경매가 존재하지 않습니다."));

        String redisKey = "auction:" + auctionId + ":status";
        Map<Object, Object> currentBidData = redisTemplate.opsForHash().entries(redisKey);

        if (currentBidData == null || currentBidData.isEmpty()) {
            log.error("Redis에서 경매를 찾을 수 없습니다. 경매ID: {}", auctionId);
            throw new AuctionNotFoundException("경매 정보를 찾을 수 없습니다.");
        }

        // redis에 담긴 마지막 입찰자와 종료 시간 변경
    }
}