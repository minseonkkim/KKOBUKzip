package com.turtlecoin.auctionservice.domain.auction.controller;

import com.turtlecoin.auctionservice.domain.auction.dto.AuctionResponseDTO;
import com.turtlecoin.auctionservice.domain.auction.dto.BidRequestDTO;
import com.turtlecoin.auctionservice.domain.auction.dto.RegisterAuctionDTO;
import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.domain.auction.service.AuctionService;
import com.turtlecoin.auctionservice.domain.turtle.dto.TurtleResponseDTO;
import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import com.turtlecoin.auctionservice.domain.turtle.service.TurtleService;
import com.turtlecoin.auctionservice.global.ResponseVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auction")
public class AuctionController {

    private final TurtleService turtleService;

    //거북이 정보 조회
    @GetMapping("/info")
    public TurtleResponseDTO getTurtleInfo() {
        // turtleId는 1로 고정
        Long turtleId = 1L;
        return turtleService.getTurtleInfo(turtleId);
    }

    private final AuctionService auctionService;
    private final AuctionRepository auctionRepository;

    // 테스트
    @GetMapping("/test")
    public ResponseEntity<String> test () {
        return ResponseEntity.status(HttpStatus.OK).body("OK");
    }

    // 경매 등록
    @PostMapping
    public ResponseEntity<?> registerAuction(
            @RequestPart("data") RegisterAuctionDTO registerAuctionDTO,
            @RequestPart(value = "images", required = false) List<MultipartFile> multipartFiles) {
        try {
            // 이미지가 없다면 빈 리스트로 처리
            if (multipartFiles == null) {
                multipartFiles = new ArrayList<>();
            }

            Auction registeredAuction = auctionService.registerAuction(registerAuctionDTO, multipartFiles);
            AuctionResponseDTO responseDTO = auctionService.convertToDTO(registeredAuction);
            return new ResponseEntity<>(ResponseVO.success("경매 등록에 성공했습니다.", "auction", responseDTO), HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(ResponseVO.failure("경매 등록에 실패했습니다.", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAuctions(
            @RequestParam(value = "gender", required = false) Gender gender,
            @RequestParam(value = "minSize", required = false) Double minSize,
            @RequestParam(value = "maxSize", required = false) Double maxSize,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "progress", required = false) AuctionProgress progress,
            @RequestParam(value = "page", defaultValue = "1") int page
    ) {
        List<AuctionResponseDTO> auctionDTOs = auctionService.getFilteredAuctions(gender, minSize, maxSize, minPrice, maxPrice, progress, page)
                .stream()
                .map(auctionService::convertToDTO)
                .collect(Collectors.toList());

        return new ResponseEntity<>(
                ResponseVO.success("경매 목록 조회에 성공했습니다.", "auctions", auctionDTOs),
                HttpStatus.OK
        );
    }

    @GetMapping("/{auctionId}")
    public ResponseEntity<?> getAuctionById(@PathVariable Long auctionId) {
        return auctionService.getAuctionWithTurtleInfo(auctionId)
                .map(auction -> {
                    AuctionResponseDTO responseDTO = auctionService.convertToDTO(auction);
                    return new ResponseEntity<>(responseDTO, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/{auctionId}/bid")
    public ResponseEntity<?> auctionBid(@PathVariable Long auctionId, @RequestBody BidRequestDTO bidRequestdto) {
        Long newBidAmount = bidRequestdto.getBidAmount();
        Long userId = bidRequestdto.getUserId();

        Map<Object, Object> currentBidData = auctionService.getCurrentBid(auctionId);



        if (currentBid == null || newBidAmount > currentBid) {
            auctionService.updateBid(auctionId, );
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }
}

