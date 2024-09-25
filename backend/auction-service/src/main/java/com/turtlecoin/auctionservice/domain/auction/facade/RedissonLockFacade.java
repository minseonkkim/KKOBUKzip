package com.turtlecoin.auctionservice.domain.auction.facade;

import com.turtlecoin.auctionservice.domain.auction.service.AuctionService;
import lombok.RequiredArgsConstructor;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class RedissonLockFacade {

    private final RedissonClient redissonClient;
    private final AuctionService auctionService;

    public void updateBidWithLock(Long auctionId, Long userId, Double bidAmount) {
        // 경매 ID를 기반으로 락을 생성
        RLock lock = redissonClient.getLock(auctionId.toString());

        try {
            // 10초 동안 락을 시도하고, 1초 동안만 유지
            boolean available = lock.tryLock(10, 1, TimeUnit.SECONDS);

            if (!available) {
                System.out.println("Lock 획득 실패");
                return;
            }

            // 락을 성공적으로 획득한 경우 입찰 처리
            auctionService.processBidWithoutLock(auctionId, userId, bidAmount);

        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            // 락 해제
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}
