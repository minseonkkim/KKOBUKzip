package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionTag;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionPhoto;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
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
    private List<String> tags;
    private List<String> images;

    public static AuctionResponseDTO fromEntity(Auction auction) {
        return new AuctionResponseDTO(
                auction.getId(),
                auction.getTurtleId(),
                auction.getTitle(),
                auction.getMinBid(),
                auction.getWinningBid(),
                auction.getBuyerId(),
                auction.getSellerId(),
                auction.getStartTime(),
                auction.getEndTime(),
                auction.getContent(),
                auction.getAuctionProgress().name(),
                auction.getTags().stream().map(AuctionTag::getTag).toList(),
                auction.getAuctionPhotos().stream().map(AuctionPhoto::getImageUrl).toList()
        );
    }
}
