package com.turtlecoin.auctionservice.domain.auction.repository;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {
    Boolean existsByTurtleId(Long turtleId);

    @Query("select a from Auction a where a.auctionProgress = :progress")
    List<Auction> findByAuctionProgress(@Param("progress") AuctionProgress progress);

    @Query("select count(*) from Auction a where (a.auctionProgress = :progress1 or a.auctionProgress = :progress2) and a.turtleId = :turtleId")
    Long countInProgressAuctionByTurtleId(@Param("progress1") AuctionProgress progress1, @Param("progress2") AuctionProgress progress2, @Param("turtleId") Long turtleId);
}
