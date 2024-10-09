package com.turtlecoin.auctionservice.domain.auction.facade;

import com.turtlecoin.auctionservice.domain.auction.service.BidService;
import com.turtlecoin.auctionservice.global.exception.BidConcurrencyException;
import com.turtlecoin.auctionservice.global.response.ResponseVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@Slf4j
@RequiredArgsConstructor
public class RedissonLockFacade {

    private final RedissonClient redissonClient;
    private final BidService bidService;
    private final SimpMessagingTemplate messagingTemplate;

    public void updateBidWithLock(Long auctionId, Long userId, Double bidAmount) throws Exception{
        RLock lock = redissonClient.getLock(auctionId.toString());
        log.info("Redis를 이용한 락 실행");
        try {
            boolean available = lock.tryLock(5, 2, TimeUnit.SECONDS);

            if (!available) {
                log.info("Lock 실패");
                String destination = "/user/" + userId + "/queue/auction";
                messagingTemplate.convertAndSendToUser(userId.toString(), destination,
                        ResponseVO.failure("Bid","409", "다른 사람이 입찰 중입니다. 잠시 후 다시 시도하세요."));
                throw new BidConcurrencyException("다른 사람이 입찰 중입니다. 잠시 후 다시 시도하세요.");
            }

        } catch (InterruptedException e) {
            System.out.println("인터럽트 익셉션");
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        } finally {
            log.info("Lock 성공");
            bidService.processBidWithRedis(auctionId, userId, bidAmount);  // BidService로 분리된 로직 호출
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }

        }
    }
}
