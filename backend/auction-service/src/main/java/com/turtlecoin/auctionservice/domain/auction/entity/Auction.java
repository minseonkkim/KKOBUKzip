package com.turtlecoin.auctionservice.domain.auction.entity;

import com.turtlecoin.auctionservice.domain.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Auction extends BaseEntity {
    @Id @GeneratedValue
    @Column(unique=true, nullable=false)
    private Long id;

    //등록한 사람
    @Column(nullable=false)
    private Long sellerId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Double minBid;

    private Double winningBid;

    // 현재 입찰 회원
    private Long buyerId;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private AuctionProgress auctionProgress;

    private LocalDateTime endTime;
    // 거북이
    @Column(nullable = false)
    private Long turtleId;

    @OneToMany(mappedBy = "auction")
    @Builder.Default
    private List<AuctionPhoto> auctionPhotos = new ArrayList<>();

    @OneToMany(mappedBy = "auction")
    @Builder.Default
    private List<AuctionTag> tags = new ArrayList<>();
}
