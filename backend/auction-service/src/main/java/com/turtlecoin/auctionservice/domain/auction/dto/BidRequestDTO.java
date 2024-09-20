package com.turtlecoin.auctionservice.domain.auction.dto;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BidRequestDTO {
    private Long userId;
    private Long bidAmount;
}
