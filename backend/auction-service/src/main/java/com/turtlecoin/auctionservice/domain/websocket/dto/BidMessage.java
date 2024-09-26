package com.turtlecoin.auctionservice.domain.websocket.dto;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BidMessage {
    private Long auctionId;
    private Long userId;
    private Double bidAmount;
}
