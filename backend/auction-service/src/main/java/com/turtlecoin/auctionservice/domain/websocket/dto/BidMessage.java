package com.turtlecoin.auctionservice.domain.websocket.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.*;

@Getter
public class BidMessage {
    private Long auctionId;
    private Long userId;
    private Double bidAmount;
    private Double nextBid;

    // 기본 생성자
    public BidMessage() {
    }

    // 생성자
    public BidMessage(Long auctionId, Long userId, Double bidAmount, Double nextBid) {
        this.auctionId = auctionId;
        this.userId = userId;
        this.bidAmount = bidAmount;
        this.nextBid = nextBid;
    }
}