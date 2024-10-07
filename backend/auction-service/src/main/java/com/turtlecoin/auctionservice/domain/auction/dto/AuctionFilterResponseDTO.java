package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;

import lombok.*;


import java.util.List;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionFilterResponseDTO {
    private List<Auction> auctions;
    private int totalPages;
}