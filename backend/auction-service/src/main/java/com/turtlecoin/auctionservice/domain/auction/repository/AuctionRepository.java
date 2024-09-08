package com.turtlecoin.auctionservice.domain.auction.repository;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {
}
