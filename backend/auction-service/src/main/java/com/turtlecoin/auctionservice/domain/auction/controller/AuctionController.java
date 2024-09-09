package com.turtlecoin.auctionservice.domain.auction.controller;

import com.turtlecoin.auctionservice.domain.auction.dto.RegisterAuctionDTO;
import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.domain.auction.service.AuctionService;
import com.turtlecoin.auctionservice.global.ResponseVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auction")
public class AuctionController {

    private final AuctionService auctionService;
    private final AuctionRepository auctionRepository;

    @GetMapping("/test")
    public ResponseEntity<String> test () {
        return ResponseEntity.status(HttpStatus.OK).body("OK");
    }

    @PostMapping("/regist")
    public ResponseEntity<?> registerAuction(
            @RequestPart("data") RegisterAuctionDTO registerAuctionDTO,
            @RequestPart(value = "images", required = false) List<MultipartFile> multipartFiles) {
        try {
            // 이미지가 없다면 빈 리스트로 처리
            if (multipartFiles == null) {
                multipartFiles = new ArrayList<>();
            }

            Auction registeredAuction = auctionService.registerAuction(registerAuctionDTO, multipartFiles);
            return new ResponseEntity<>(ResponseVO.success("경매 등록에 성공했습니다."), HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(ResponseVO.failure("경매 등록에 실패했습니다.", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{auctionId}")
    public ResponseEntity<?> getAuctionById(@PathVariable Long auctionId) {
        Optional<Auction> auction = auctionService.getAuctionWithTurtleInfo(auctionId);
        return auction.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}

