package com.turtlecoin.auctionservice.domain.auction.service;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
//import com.turtlecoin.auctionservice.domain.auction.dto.AuctionResponseDTO;
import com.turtlecoin.auctionservice.domain.auction.dto.AuctionResponseDTO;
import com.turtlecoin.auctionservice.domain.auction.dto.RegisterAuctionDTO;
import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionPhoto;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import com.turtlecoin.auctionservice.domain.auction.entity.QAuction;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.domain.s3.service.ImageUploadService;
import com.turtlecoin.auctionservice.feign.dto.TurtleResponseDTO;
import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import com.turtlecoin.auctionservice.domain.turtle.service.TurtleService;
import com.turtlecoin.auctionservice.feign.MainClient;
import com.turtlecoin.auctionservice.global.exception.AuctionNotFoundException;
import com.turtlecoin.auctionservice.global.exception.TurtleAlreadyRegisteredException;
import com.turtlecoin.auctionservice.global.exception.TurtleNotFoundException;
import com.turtlecoin.auctionservice.global.exception.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuctionService {

    private RedisTemplate<String, Object> redisTemplate;
    private static final String AUCTION_BID_KEY = "auction_bid_";

    private final AuctionRepository auctionRepository;
    private final ImageUploadService imageUploadService;  // ImageUploadService도 주입합니다.
    private final TurtleService turtleService;
    private final MainClient mainClient;
    private final JPAQueryFactory queryFactory;

    // 경매 등록
    @Transactional
    public Auction registerAuction(RegisterAuctionDTO registerAuctionDTO, List<MultipartFile> images) throws IOException {
        log.info("경매 등록 시작 - 사용자 ID: {}, 거북이 ID: {}", registerAuctionDTO.getUserId(), registerAuctionDTO.getTurtleId());

        // 사용자가 소유한 거북이인지 검증
        validateUserOwnsTurtle(registerAuctionDTO.getUserId(), registerAuctionDTO.getTurtleId());

        // 거북이가 이미 올라간 거북이가 아닌지 검증하는 로직 추가
        validateTurtleNotAlreadyRegistered(registerAuctionDTO.getTurtleId());

        Auction auction = registerAuctionDTO.toEntity();
        auctionRepository.save(auction);

        if (images != null && !images.isEmpty()) {
            List<AuctionPhoto> photos = uploadImages(images, auction);
            auction.getAuctionPhotos().addAll(photos);
        }

        return auctionRepository.save(auction);
    }

    // 이미지 업로드 처리 메서드
    private List<AuctionPhoto> uploadImages(List<MultipartFile> images, Auction auction) throws IOException {
        return images.stream()
                .map(image -> {
                    try {
                        String imagePath = imageUploadService.upload(image, "auctionImages");
                        return AuctionPhoto.builder()
                                .imageAddress(imagePath)
                                .auction(auction)
                                .build();
                    } catch (IOException e) {
                        log.error("이미지 업로드 실패 : {}", image.getOriginalFilename(), e);
                        throw new RuntimeException(e);
                    }
                })
                .toList();
    }

    // 사용자가 소유한 거북이인지 검증 메서드
    private void validateUserOwnsTurtle(Long userId, Long turtleId) {
        log.info("검증 메서드 내부 진입");
        List<TurtleResponseDTO> userTurtles = mainClient.getTurtlesByUserId(userId);

        if (userTurtles.isEmpty()) {
            throw new UserNotFoundException("해당 사용자를 찾을 수 없습니다." + userId);
        }

        log.info("userTurtle : {}", userTurtles);
        boolean isUserTurtle = userTurtles.stream()
                .anyMatch(turtle -> turtle.getId().equals(turtleId));

        if (!isUserTurtle) {
            throw new TurtleNotFoundException("해당 거북이는 사용자가 소유한 거북이가 아닙니다.");
        }
        log.info("내 거북이가 맞다");
    }

    private void validateTurtleNotAlreadyRegistered (Long turtleId) {
        log.info("이미 올라간 거북이 검증 시작");
        Boolean isRegistered = auctionRepository.existsByTurtleId(turtleId);
        log.info("이미 올라간 거북이 검증 완료");

        if (isRegistered) {
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
    private void deleteUploadedImages(List<AuctionPhoto> auctionPhotos) {
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

        // 경매 정보를 빌더 패턴을 사용해 DTO로 변환
        return AuctionResponseDTO.from(auction, turtle);
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

        log.info("Turtle info retrieved: {}", turtleInfo);
        return AuctionResponseDTO.from(auction, turtleInfo);
    }

    // 입찰 가격 갱신
    public void updateBid(Long auctionId, Long userId, Long bidAmount) {
        String redisKey = AUCTION_BID_KEY + auctionId;

        Map<String, Object> bidData = new HashMap<>();
        bidData.put("userId", userId);
        bidData.put("bidAmount", bidAmount);

        Long currentBid = (Long) redisTemplate.opsForHash().get(redisKey, "bidAmount");
        Long currentUser = (Long) redisTemplate.opsForHash().get(redisKey, "userId");

        // 입찰 조건: 현재 입찰자와 다른 사용자이며, 입찰 금액이 더 클 경우에만 갱신
        if ((currentBid == null || bidAmount > currentBid) &&
                (currentUser == null || !currentUser.equals(userId))) {
            redisTemplate.opsForHash().putAll(redisKey, bidData);

            String bidHistory = redisKey + ":history";
            String bidRecord = "userId: " + userId + ", bidAmount: " + bidAmount;
            redisTemplate.opsForList().rightPush(bidHistory, bidRecord);
        }
    }

    public Map<Object, Object> getCurrentBid (Long auctionId) {
        String redisKey = AUCTION_BID_KEY + auctionId;
        return redisTemplate.opsForHash().entries(redisKey);
    }
}