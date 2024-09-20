package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.turtle.dto.TurtleResponseDTO;
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
    private TurtleResponseDTO turtleInfo;
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
    private List<AuctionPhotoDTO> images;

    public static AuctionResponseDTO from(Auction auction, TurtleResponseDTO turtleInfo) {
        return AuctionResponseDTO.builder()
                .id(auction.getId())
                .turtleId(auction.getTurtleId())
                .turtleInfo(turtleInfo)
                .title(auction.getTitle())
                .minBid(auction.getMinBid())
                .nowBid(auction.getNowBid())
                .winningBid(auction.getWinningBid())
                .buyerId(auction.getBuyerId())
                .startTime(auction.getStartTime())
                .endTime(auction.getEndTime())
                .content(auction.getContent())
                .progress(auction.getAuctionProgress().toString())
                .tags(auction.getAuctionTags().stream()
                        .map(AuctionTagDTO::from)
                        .collect(Collectors.toList()))
                .images(auction.getAuctionPhotos().stream()
                        .map(AuctionPhotoDTO::from)
                        .collect(Collectors.toList()))
                .build();
    }
}
