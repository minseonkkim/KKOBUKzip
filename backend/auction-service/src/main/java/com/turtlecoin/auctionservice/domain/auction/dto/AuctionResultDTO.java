package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AuctionResultDTO {
    private Long auctionId;
    private Long turtleId;
    private Double winningBid;
    private Long buyerId;
    private Long sellerId;
    private String sellerAddress;
    private LocalDateTime endTime;
    private AuctionProgress auctionProgress;
}
