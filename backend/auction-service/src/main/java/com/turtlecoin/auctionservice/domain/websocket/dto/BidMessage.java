package com.turtlecoin.auctionservice.domain.websocket.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidMessage {
    private Long auctionId;
    private Long userId;
    private String nickname;
    private Double bidAmount;
    private Double nextBid;
    private Double remainingTime;
}