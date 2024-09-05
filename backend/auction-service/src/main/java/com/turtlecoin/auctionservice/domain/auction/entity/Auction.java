package com.turtlecoin.auctionservice.domain.auction.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Auction {
    @Id @GeneratedValue
    @Column(unique=true, nullable=false)
    private Long id;

    private String title;
    private Double minBid;
    private Double winningBid;
    // 현재 입찰 회원
    private Long buyerId;
    private LocalDateTime startTime;
    private String content;
    private AuctionProgress auctionProgress;
    private LocalDateTime endTime;
    // 거북이
    private Long turtleId;

}
