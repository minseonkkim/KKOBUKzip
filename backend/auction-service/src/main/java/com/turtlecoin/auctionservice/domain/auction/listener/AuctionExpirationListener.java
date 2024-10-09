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
    private final SimpMessagingTemplate messagingTemplate;
    private final SendService sendService;
    private final AuctionRepository auctionRepository;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        ResponseVO<Object> response;
        String expiredKey = new String(message.getBody());
        log.info("Expired key received: {}", expiredKey);

        if (expiredKey.startsWith(AUCTION_END_KEY_PREFIX)) {
            Long auctionId = Long.parseLong(expiredKey.substring(AUCTION_END_KEY_PREFIX.length()));
            Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new AuctionNotFoundException("경매를 찾을 수 없습니다."));
            try {
                sendService.endAuction(auctionId);
                System.out.println("경매 종료!!");
                System.out.println("경매 종료 보내준 시간 : "+LocalDateTime.now());
            } catch (Exception e) {
                // 에러 발생 시 경매 전으로 상태 갱신
                auction.updateStatus(AuctionProgress.BEFORE_AUCTION);

                response = ResponseVO.failure("50000", "예상치 못한 문제가 발생했습니다.");
                messagingTemplate.convertAndSend("/sub/auction/" + auctionId, response);

                log.error("경매 종료 처리 중 오류 발생: auctionId = {}, error = {}", auctionId, e.getMessage());
            }
        }
    }
}
