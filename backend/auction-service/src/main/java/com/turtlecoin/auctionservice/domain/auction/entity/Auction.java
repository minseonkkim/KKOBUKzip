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
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique=true, nullable=false)
    private Long id;

    //등록한 사람
    @Column(nullable=false)
    private Long userId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Double minBid;
    private Double nowBid;
    private Double winningBid;

    // 현재 입찰 회원
    private Long buyerId;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AuctionProgress auctionProgress;

    private LocalDateTime endTime;
    // 거북이
    @Column(nullable = false)
    private Long turtleId;

    @OneToMany(mappedBy = "auction", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @Builder.Default
    private List<AuctionPhoto> auctionPhotos = new ArrayList<>();

    @OneToMany(mappedBy = "auction")
    @Builder.Default
    private List<AuctionTag> auctionTags = new ArrayList<>();

    @Column(name="seller_address")
    private String sellerAddress;

    public void updateEndTime() {
        this.endTime = LocalDateTime.now().plusSeconds(30);
    }

    public void updateStatus(AuctionProgress auctionProgress) {
        this.auctionProgress = auctionProgress;
    }

    public void updateAfterAuction(Long buyerId, Double winningBid) {
        this.buyerId = buyerId;
        this.winningBid = winningBid;
    }
}
