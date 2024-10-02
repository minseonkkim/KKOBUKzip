package com.turtlecoin.auctionservice.domain.auction.listener;

import com.turtlecoin.auctionservice.domain.auction.dto.AuctionResultDTO;
import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.domain.auction.service.AuctionService;
import com.turtlecoin.auctionservice.domain.auction.service.SendService;
import com.turtlecoin.auctionservice.global.exception.AuctionNotFoundException;
import com.turtlecoin.auctionservice.global.response.ResponseVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuctionExpirationListener implements MessageListener {

    private static final String AUCTION_END_KEY_PREFIX = "auction_end_";
//    private final AuctionService auctionService;
    private final SendService sendService;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String expiredKey = new String(message.getBody());
        log.info("Expired key received: {}", expiredKey);

        if (expiredKey.startsWith(AUCTION_END_KEY_PREFIX)) {
            Long auctionId = Long.parseLong(expiredKey.substring(AUCTION_END_KEY_PREFIX.length()));
            try {
                sendService.endAuction(auctionId);
                System.out.println("경매 종료!!");
            } catch (Exception e) {

                log.error("경매 종료 처리 중 오류 발생: auctionId = {}, error = {}", auctionId, e.getMessage());
            }
        }
    }
}
