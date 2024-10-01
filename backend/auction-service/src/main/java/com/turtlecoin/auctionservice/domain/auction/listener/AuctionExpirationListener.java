package com.turtlecoin.auctionservice.domain.auction.listener;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.global.exception.AuctionNotFoundException;
import com.turtlecoin.auctionservice.global.response.ResponseVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuctionExpirationListener implements MessageListener {
    private final AuctionRepository auctionRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private static final String AUCTION_END_KEY_PREFIX = "auction_end_";
    private static final String AUCTION_BID_KEY_PREFIX = "auction_bid_";
    private final RedisTemplate redisTemplate;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String expiredKey = new String(message.getBody());
        log.info("Expired key received: {}", expiredKey);

        if (expiredKey.startsWith(AUCTION_END_KEY_PREFIX)) {
            Long auctionId = Long.parseLong(expiredKey.substring(AUCTION_END_KEY_PREFIX.length()));
            try {
                endAuction(auctionId);
                System.out.println("경매 종료!!");
            } catch (Exception e) {
                log.error("경매 종료 처리 중 오류 발생: auctionId = {}, error = {}", auctionId, e.getMessage());
            }
        }
    }

    // 경매 종료 알림, DB저장 로직
    public void endAuction(Long auctionId) {
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new AuctionNotFoundException("경매를 찾을 수 없습니다"));

        String redisBidKey = AUCTION_BID_KEY_PREFIX + auctionId;
        Map<Object, Object> bidData = redisTemplate.opsForHash().entries(redisBidKey);

        if (bidData.isEmpty()) {
            log.info("해당 경매에 입찰 기록이 없습니다: auctionId = {}", auctionId);
            return;
        }

        // 마지막 입찰가와 입찰자 ID 가져오기
        Double winningBid = Double.parseDouble(bidData.get("bidAmount").toString());
        Long winningUserId = Long.parseLong(bidData.get("userId").toString());

        auction.updateStatus(AuctionProgress.SUCCESSFUL_BID);
        auction.updateAfterAuction(winningUserId, winningBid);
        messagingTemplate.convertAndSend("/sub/auction/" + auctionId,
                ResponseVO.success("auctionStatus", "경매가 종료되었습니다."));

        log.info("경매 종료 처리 완료: auctionId = {}", auctionId);
    }
}
