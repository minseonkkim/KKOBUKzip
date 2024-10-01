package com.turtlecoin.mainservice.domain.transaction.dto;

import com.turtlecoin.mainservice.domain.transaction.entity.AuctionProgress;
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
    private AuctionProgress auctionProgress;
    private Long turtleId;
    private Long auctionId;
    private String sellerAddress;
    private boolean auctionFlag;
    private Long buyerId;
    private Long sellerId;
    private String imageAddress;
}