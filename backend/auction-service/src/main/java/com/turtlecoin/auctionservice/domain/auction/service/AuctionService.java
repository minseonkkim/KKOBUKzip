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
import com.turtlecoin.auctionservice.domain.turtle.dto.AuctionTurtleInfoDTO;
import com.turtlecoin.auctionservice.domain.turtle.dto.TurtleResponseDTO;
import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import com.turtlecoin.auctionservice.domain.turtle.service.TurtleService;
import com.turtlecoin.auctionservice.global.client.TurtleClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final ImageUploadService imageUploadService;  // ImageUploadService도 주입합니다.
    private final TurtleService turtleService;
    private final TurtleClient turtleClient;
    private final JPAQueryFactory queryFactory;

    // 경매 등록
    @Transactional
    public Auction registerAuction(RegisterAuctionDTO registerAuctionDTO, List<MultipartFile> images) throws IOException {
        List<String> uploadedImagePaths = new ArrayList<>();
        List<AuctionPhoto> auctionPhotos = new  ArrayList<>();

        try {
            // 이미지 업로드
            for (MultipartFile multipartFile : images) {
                String imagePath = imageUploadService.upload(multipartFile, "auctionImages");
                uploadedImagePaths.add(imagePath);
                auctionPhotos.add(AuctionPhoto.builder().imageAddress(imagePath).build());
            }

            // Auction 엔티티 생성 및 저장
            Auction auction = registerAuctionDTO.toEntity(auctionPhotos);
            return auctionRepository.save(auction);

        } catch (IOException e) {
            // 업로드 도중 실패 시 이미 업로드된 이미지 삭제
            for (String imagePath : uploadedImagePaths) {
                imageUploadService.deleteS3(imagePath);
            }
            log.error("경매 등록 실패: {}", e.getMessage());
            throw e;  // 예외를 다시 던져서 컨트롤러에서 처리할 수 있도록 합니다.
        }
    }

    // 거북이 정보로 경매 조회
    public Optional<Auction> getAuctionWithTurtleInfo(Long auctionId) {
        Optional<Auction> auction = auctionRepository.findById(auctionId);

        auction.ifPresent(a -> {
            TurtleResponseDTO turtleInfo = turtleService.getTurtleInfo(a.getTurtleId());
            log.info("Turtle Info: {}", turtleInfo);
        });

        return auction;
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

        List<AuctionTurtleInfoDTO> filteredTurtles = turtleClient.getFilteredTurtles(gender, minSize, maxSize);

        List<Auction> filteredAuctions = queryFactory.selectFrom(auction)
                .where(whereClause.and(auction.turtleId.in(
                        filteredTurtles.stream().map(AuctionTurtleInfoDTO::getId).collect(Collectors.toList()))))
                .offset((page-1) * 10)
                .limit(10)
                .fetch();


        // 페이징 처리
        return filteredAuctions;
    }

    public AuctionResponseDTO convertToDTO(Auction auction) {
        TurtleResponseDTO turtleInfo = turtleService.getTurtleInfo(auction.getTurtleId());

        return AuctionResponseDTO.from(auction, turtleInfo);
    }
}