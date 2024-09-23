package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.AuctionPhoto;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AuctionPhotoDTO {
    private String imageAddress;

    public static AuctionPhotoDTO from(AuctionPhoto photo) {
        return new AuctionPhotoDTO(photo.getImageAddress());
    }
}
