package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionPhoto;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionTag;
import com.turtlecoin.auctionservice.feign.dto.TurtleFilteredResponseDTO;
import com.turtlecoin.auctionservice.feign.dto.TurtleResponseDTO;
import com.turtlecoin.auctionservice.feign.dto.UserResponseDTO;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Slf4j
public class AuctionResponseDTO {
    private Long id;
    private Long turtleId;
    private String title;
    private Double minBid;
    private Double nowBid;
    private Double winningBid;
    private Long sellerId;
    private Long buyerId;
    private String sellerAddress;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String content;
    private String progress;
    private Long remainingTime;
    private String scientificName;
    private List<String> tags;

    // 이미지 주소 리스트로 변경
    private List<String> images;

    private TurtleFilteredResponseDTO turtleInfo;
    private UserResponseDTO userInfo;

    public static AuctionResponseDTO from(Auction auction, TurtleFilteredResponseDTO turtleInfo, UserResponseDTO userInfo, Long remainingTime, Double nowBid) {
        log.info("Auction Tags: {}", auction.getAuctionTags());
        return AuctionResponseDTO.builder()
                .id(auction.getId())
                .turtleId(auction.getTurtleId())
                .title(auction.getTitle())
                .minBid(auction.getMinBid())
                .nowBid(nowBid)
                .winningBid(auction.getWinningBid())
                .buyerId(auction.getBuyerId())
                .sellerId(auction.getUserId())
                .startTime(auction.getStartTime())
                .endTime(LocalDateTime.now())
                .content(auction.getContent())
                .sellerAddress(auction.getSellerAddress())
                .remainingTime(remainingTime)
                .scientificName("다이아몬드 백 테라핀")
                .progress(auction.getAuctionProgress().toString())
                .tags(auction.getAuctionTags().stream()
                        .map(AuctionTag::getTag)
                        .collect(Collectors.toList())) // 태그 리스트
                .images(auction.getAuctionPhotos().stream()  // 이미지 주소만 추출
                        .map(AuctionPhoto::getImageAddress)
                        .toList())
                .turtleInfo(turtleInfo) // Turtle 정보 추가
                .userInfo(userInfo)
                .build();
    }
}