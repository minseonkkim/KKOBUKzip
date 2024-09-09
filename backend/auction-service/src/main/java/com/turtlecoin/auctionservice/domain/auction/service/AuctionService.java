package com.turtlecoin.auctionservice.domain.auction.service;

import com.querydsl.jpa.impl.JPAQueryFactory;
//import com.turtlecoin.auctionservice.domain.auction.dto.AuctionResponseDTO;
import com.turtlecoin.auctionservice.domain.auction.dto.RegisterAuctionDTO;
import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionPhoto;
import com.turtlecoin.auctionservice.domain.auction.entity.QAuction;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.domain.s3.service.ImageUploadService;
import com.turtlecoin.auctionservice.domain.turtle.dto.TurtleResponse;
import com.turtlecoin.auctionservice.domain.turtle.service.TurtleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final ImageUploadService imageUploadService;  // ImageUploadService도 주입합니다.
    private final TurtleService turtleService;

    @Transactional
    public Auction registerAuction(RegisterAuctionDTO registerAuctionDTO, List<MultipartFile> images) throws IOException {
        List<String> uploadedImagePaths = new ArrayList<>();
        List<AuctionPhoto> auctionPhotos = new ArrayList<>();

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

    public Optional<Auction> getAuctionWithTurtleInfo(Long auctionId) {
        Optional<Auction> auction = auctionRepository.findById(auctionId);

        auction.ifPresent(a -> {
            TurtleResponse turtleInfo = turtleService.getTurtleInfo(a.getTurtleId());
            log.info("Turtle Info: {}", turtleInfo);
        });

        return auction;
    }
}