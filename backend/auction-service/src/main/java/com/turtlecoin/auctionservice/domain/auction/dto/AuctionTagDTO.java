package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.AuctionTag;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuctionTagDTO {
    private String tag;

    public static AuctionTagDTO from(AuctionTag tag) {
        return new AuctionTagDTO(tag.getTag());
    }
}
