package com.turtlecoin.auctionservice.websocket.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendBidUpdate(Long auctionId, Long userId, Double bidAmount) {
        String destination = "/auction/topic/" + auctionId;
        String message = "userId: " + userId + ", bidAmount: " + bidAmount;

        messagingTemplate.convertAndSend(destination, message);
    }
}
