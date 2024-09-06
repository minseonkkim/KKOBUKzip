package com.turtlecoin.auctionservice.domain.auction.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RegisterAuctionDTO {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double minBid;
    private String content;
    private List<String> images;
}
