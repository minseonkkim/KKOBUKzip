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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuctionExpirationListener implements MessageListener {
    private final AuctionRepository auctionRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private static final String AUCTION_END_KEY_PREFIX = "auction_end_";

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

        auction.updateStatus(AuctionProgress.SUCCESSFUL_BID);
        auctionRepository.save(auction);

        messagingTemplate.convertAndSend("/sub/auction/" + auctionId,
                ResponseVO.success("auctionStatus", "경매가 종료되었습니다."));

        log.info("경매 종료 처리 완료: auctionId = {}", auctionId);
    }
}
