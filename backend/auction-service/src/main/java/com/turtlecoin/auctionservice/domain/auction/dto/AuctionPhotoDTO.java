package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.AuctionPhoto;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuctionPhotoDTO {
    private String imageAddress;

    public static AuctionPhotoDTO from(AuctionPhoto photo) {
        return new AuctionPhotoDTO(photo.getImageAddress());
    }
}
