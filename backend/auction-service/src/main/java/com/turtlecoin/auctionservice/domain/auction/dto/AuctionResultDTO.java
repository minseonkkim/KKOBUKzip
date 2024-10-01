package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AuctionResultDTO {
    private String title;
    private String content;
    private Double winningBid;
    private int weight;
    private Long turtleId;
    private Long auctionId;
    private String sellerAddress;
    private boolean auctionFlag;
    private Long buyerId;
    private Long sellerId;
    private String imageAddress;
}
