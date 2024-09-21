package com.turtlecoin.auctionservice.domain.auction.service;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
//import com.turtlecoin.auctionservice.domain.auction.dto.AuctionResponseDTO;
import com.turtlecoin.auctionservice.domain.auction.dto.AuctionPhotoDTO;
import com.turtlecoin.auctionservice.domain.auction.dto.AuctionResponseDTO;
import com.turtlecoin.auctionservice.domain.auction.dto.AuctionTagDTO;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

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
        List<AuctionPhoto> auctionPhotos = new ArrayList<>();

        try {
            log.info("이미지 업로드 시작");
            // 이미지 업로드
            auctionPhotos = uploadImages(images);
            log.info("거북이 검증 시작");
            // 사용자가 소유한 거북이인지 검증
            validateUserOwnsTurtle(registerAuctionDTO.getUserId(), registerAuctionDTO.getTurtleId());

            // 거북이가 이미 올라간 거북이가 아닌지 검증하는 로직 추가
            validateTurtleNotAlreadyRegistered(registerAuctionDTO.getTurtleId());

            log.info("거북이 정보 조회 및 DTO설정");
            // 거북이 정보 조회 및 DTO에 설정
            RegisterAuctionDTO updatedAuctionDTO = updateAuctionWithTurtleInfo(registerAuctionDTO);
            log.info("경매 정보 저장");
            // 경매 저장
            return saveAuction(updatedAuctionDTO, auctionPhotos);

        } catch (IOException e) {
            // 업로드 도중 실패 시 이미 업로드된 이미지 삭제
            deleteUploadedImages(auctionPhotos);  // 예외 발생 시 이미지 삭제 처리
            log.error("경매 등록 실패: {}", e.getMessage());
            throw e;
        }
    }

    // 이미지 업로드 처리 메서드
    private List<AuctionPhoto> uploadImages(List<MultipartFile> images) throws IOException {
        List<AuctionPhoto> auctionPhotos = new ArrayList<>();

        if (images != null) {
            for (MultipartFile multipartFile : images) {
                String imagePath = imageUploadService.upload(multipartFile, "auctionImages");
                auctionPhotos.add(AuctionPhoto.builder().imageAddress(imagePath).build());
            }
        }
        return auctionPhotos;
    }

    // 사용자가 소유한 거북이인지 검증 메서드
    private void validateUserOwnsTurtle(Long userId, Long turtleId) {
        log.info("검증 메서드 내부 진입");
        List<TurtleResponseDTO> userTurtles = mainClient.getTurtlesByUserId(userId);
        log.info("userTurtle : {}", userTurtles);
        boolean isUserTurtle = userTurtles.stream()
                .anyMatch(turtle -> turtle.getId().equals(turtleId));

        if (!isUserTurtle) {
            throw new IllegalArgumentException("해당 거북이는 사용자가 소유한 거북이가 아닙니다.");
        }
        log.info("내 거북이가 맞다");
    }

    private void validateTurtleNotAlreadyRegistered (Long turtleId) {
        Boolean isRegistered = auctionRepository.existsByTurtleId(turtleId);

        if (isRegistered) {
            throw new IllegalArgumentException("이미 등록된 거북이는 등록할 수 없습니다.");
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
    private Auction saveAuction(RegisterAuctionDTO registerAuctionDTO, List<AuctionPhoto> auctionPhotos) {
        Auction auction = registerAuctionDTO.toEntity(auctionPhotos);
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
                .orElseThrow(() -> new IllegalArgumentException("경매를 찾을 수 없습니다: " + auctionId));

        log.info("경매 ID로 경매 조회");

        List<AuctionTagDTO> auctionTagDTOs = auction.getAuctionTags().stream()
                .map(tag -> AuctionTagDTO.builder()
                        .id(tag.getId())
                        .tag(tag.getTag())
                        .build())
                .toList();

        List<AuctionPhotoDTO> auctionPhotoDTOS = auction.getAuctionPhotos().stream()
                .map(photo -> AuctionPhotoDTO.builder()
                        .id(photo.getId())
                        .imageAddress(photo.getImageAddress())
                        .build())
                .toList();

        // 경매 정보를 빌더 패턴을 사용해 DTO로 변환
        return AuctionResponseDTO.builder()
                .id(auction.getId())
                .turtleId(auction.getTurtleId())
                .title(auction.getTitle())
                .minBid(auction.getMinBid())
                .nowBid(auction.getNowBid())
                .winningBid(auction.getWinningBid())
                .sellerId(auction.getUserId())
                .buyerId(auction.getBuyerId())
                .startTime(auction.getStartTime())
                .endTime(auction.getEndTime())
                .content(auction.getContent())
                .progress(auction.getAuctionProgress().name())
                .tags(auctionTagDTOs)
                .images(auctionPhotoDTOS)
                .build();
    }

    // 경매 필터링 후 조회
    public List<Auction> getFilteredAuctions(Gender gender, Double minSize, Double maxSize, Double minPrice, Double maxPrice, AuctionProgress progress, int page) {
        QAuction auction = QAuction.auction;

        BooleanBuilder whereClause = new BooleanBuilder();

        // 가격 필터 (minPrice ~ maxPrice)
        if (minPrice != null && maxPrice != null) {
            whereClause.and(auction.minBid.between(minPrice, maxPrice));
        }

        // 경매 진행 상태 필터
        if (progress != null) {
            whereClause.and(auction.auctionProgress.eq(progress));
        }

        // main-service에서 필터링 엔드포인트 열어둘 것
        List<TurtleResponseDTO> filteredTurtles = mainClient.getFilteredTurtles(gender, minSize, maxSize);

        return queryFactory.selectFrom(auction)
                .where(whereClause.and(auction.turtleId.in(
                        filteredTurtles.stream().map(TurtleResponseDTO::getId).collect(Collectors.toList()))))
                .offset((page-1L) * 10)
                .limit(10)
                .fetch();
    }

//    // 거북이 정보를 받아와서 경매정보를 DTO로 변환
//    // 수정, 테스트 필요
    public AuctionResponseDTO convertToDTO(Auction auction) {
        TurtleResponseDTO turtleInfo = turtleService.getTurtleInfo(auction.getTurtleId());

        return AuctionResponseDTO.from(auction);
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