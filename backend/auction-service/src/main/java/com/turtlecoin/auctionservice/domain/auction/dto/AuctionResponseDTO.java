package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionTag;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionPhoto;
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
    private Double winningBid;
    private Long sellerId;
    private Long buyerId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String content;
    private String progress;
    private List<AuctionTag> tags;
    private List<AuctionPhoto> images;

    public static AuctionResponseDTO from(Auction auction) {
        return AuctionResponseDTO.builder()
                .id(auction.getId())
                .turtleId(auction.getTurtleId())
                .title(auction.getTitle())
                .minBid(auction.getMinBid())
                .winningBid(auction.getWinningBid())
                .buyerId(auction.getBuyerId())
                .startTime(auction.getStartTime())
                .endTime(auction.getEndTime())
                .content(auction.getContent())
                .progress(auction.getAuctionProgress().toString())
                .tags(auction.getAuctionTags())
                .images(auction.getAuctionPhotos())
                .build();
    }
}
