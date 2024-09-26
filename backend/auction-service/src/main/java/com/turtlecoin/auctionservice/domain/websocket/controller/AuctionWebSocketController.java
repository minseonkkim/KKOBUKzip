package com.turtlecoin.auctionservice.domain.websocket.controller;

import com.turtlecoin.auctionservice.domain.websocket.dto.BidMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class AuctionWebSocketController {

    // 클라이언트가 특정 경매에 입찰을 보낼 때 (/pub/auction/{auctionId}/bid)
    @MessageMapping("/auction/{auctionId}/bid")
    @SendTo("/sub/auction/{auctionId}") // 해당 경매 참가자들에게만 메시지 전송
    public BidMessage processBid(@DestinationVariable Long auctionId, BidMessage bidMessage) throws Exception {
        System.out.println("Received bid for auctionId: " + auctionId + ", bidAmount: " + bidMessage.getBidAmount());

        // 여기서 비즈니스 로직 (입찰 처리)

        return bidMessage;
    }
}
