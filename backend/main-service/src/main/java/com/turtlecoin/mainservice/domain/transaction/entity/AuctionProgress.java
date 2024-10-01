package com.turtlecoin.mainservice.domain.transaction.entity;

public enum AuctionProgress {
    // 경매 전, 경매 중, 유찰, 낙찰
    BEFORE_AUCTION, DURING_AUCTION, NO_BID, SUCCESSFUL_BID
}
