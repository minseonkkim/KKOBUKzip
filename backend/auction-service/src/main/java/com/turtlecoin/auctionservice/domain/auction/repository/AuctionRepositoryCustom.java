package com.turtlecoin.auctionservice.domain.auction.repository;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;

import java.util.List;

public interface AuctionRepositoryCustom {
    List<Auction> findAuctionsByFilters(String gender, Double minSize, Double maxSize, Double minPrice, Double maxPrice, String progress, int page);
}
