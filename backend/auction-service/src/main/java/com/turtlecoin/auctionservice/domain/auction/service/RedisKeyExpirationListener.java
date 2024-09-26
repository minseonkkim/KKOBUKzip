//package com.turtlecoin.auctionservice.domain.auction.service;
//import org.springframework.data.redis.connection.Message;
//
//import lombok.RequiredArgsConstructor;
//import org.redisson.api.listener.MessageListener;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class RedisKeyExpirationListener implements MessageListener {
//    private final AuctionService auctionService;
//
//    @Override
//    public void onMessage(Message message, byte[] pattern) {
//        String expiredKey = message.toString();
//
//        if (expiredKey.startsWith("auction:") && expiredKey.endsWith(":status")) {
//            Long auctionId = extractAuctionIdFromKey(expiredKey);
//            auctionService.endAuction(auctionId);
//            System.out.println("경매 종료 처리됨. 경매 ID: "+auctionId);
//        }
//    }
//
//    private Long extractAuctionIdFromKey(String key) {
//        return Long.valueOf(key.split(":")[1]);
//    }
//}
