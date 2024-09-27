package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionPhoto;
import com.turtlecoin.auctionservice.feign.dto.TurtleResponseDTO;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AuctionResponseDTO {
    private Long id;
    private Long turtleId;
    private String title;
    private Double minBid;
    private Double nowBid;
    private Double winningBid;
    private Long sellerId;
    private Long buyerId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String content;
    private String progress;
    private List<AuctionTagDTO> tags;

    // 이미지 주소 리스트로 변경
    private List<String> images;

    private TurtleResponseDTO turtleInfo;

    public static AuctionResponseDTO from(Auction auction, TurtleResponseDTO turtleInfo) {
        return AuctionResponseDTO.builder()
                .id(auction.getId())
                .turtleId(auction.getTurtleId())
                .title(auction.getTitle())
                .minBid(auction.getMinBid())
                .nowBid(auction.getNowBid())
                .winningBid(auction.getWinningBid())
                .buyerId(auction.getBuyerId())
                .sellerId(auction.getUserId())
                .startTime(auction.getStartTime())
                .endTime(LocalDateTime.now())
                .content(auction.getContent())
                .progress(auction.getAuctionProgress().toString())
                .tags(auction.getAuctionTags().stream()
                        .map(AuctionTagDTO::from)
                        .toList())
                .images(auction.getAuctionPhotos().stream()  // 이미지 주소만 추출
                        .map(AuctionPhoto::getImageAddress)
                        .toList())
                .turtleInfo(turtleInfo) // Turtle 정보 추가
                .build();
    }
}