package com.turtlecoin.auctionservice.domain.auction.controller;

import com.turtlecoin.auctionservice.domain.auction.dto.RegisterAuctionDTO;
import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionPhoto;
import com.turtlecoin.auctionservice.domain.auction.service.AuctionService;
import com.turtlecoin.auctionservice.domain.s3.service.ImageUploadService;
import com.turtlecoin.auctionservice.global.ResponseVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auction")
public class AuctionController {

    private final AuctionService auctionService;
    private final ImageUploadService imageUploadService;

    @PostMapping
    public ResponseEntity<?> registerAuction(
            @RequestParam("data") RegisterAuctionDTO registerAuctionDTO,
            @RequestParam("images") List<MultipartFile> multipartFiles) {
        List<String> uploadedImagePaths = new ArrayList<>();
        List<AuctionPhoto> auctionPhotos = new ArrayList<>();

        try {
            for (MultipartFile multipartFile : multipartFiles) {
                String imagePath = imageUploadService.upload(multipartFile, "auctionImages");
                uploadedImagePaths.add(imagePath);
                auctionPhotos.add(AuctionPhoto.builder().imageAddress(imagePath).build());
            }

            // 테스트 해봐야함
            Auction uploadedAuction = Auction.builder()
                    .id(registerAuctionDTO.getId())
                    .startTime(registerAuctionDTO.getStartTime())
                    .endTime(registerAuctionDTO.getEndTime())
                    .minBid(registerAuctionDTO.getMinBid())
                    .content(registerAuctionDTO.getContent())
                    .auctionPhotos(auctionPhotos)  // 사진 리스트 추가
                    .build();

            auctionService.save(uploadedAuction);

            return new ResponseEntity<>(ResponseVO.success("경매 등록에 성공했습니다."), HttpStatus.OK);

        } catch (IOException e) {
            for (String imagePath : uploadedImagePaths) {
                imageUploadService.deleteS3(imagePath);
            }
            return new ResponseEntity<>(ResponseVO.failure("경매 등록에 실패했습니다.", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}