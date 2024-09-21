package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.AuctionTag;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AuctionTagDTO {
    private Long id;
    private String tag;

    public static AuctionTagDTO from(AuctionTag tag) {
        return new AuctionTagDTO(tag.getId(), tag.getTag());
    }
}
