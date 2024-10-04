package com.turtlecoin.auctionservice.domain.auction.facade;

import com.turtlecoin.auctionservice.domain.auction.service.AuctionService;
import com.turtlecoin.auctionservice.domain.auction.service.BidService;
import com.turtlecoin.auctionservice.global.exception.AuctionNotFoundException;
import lombok.RequiredArgsConstructor;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class RedissonLockFacade {

    private final RedissonClient redissonClient;
    private final BidService bidService;

    public void updateBidWithLock(Long auctionId, Long userId, Double bidAmount) {
        RLock lock = redissonClient.getLock(auctionId.toString());
        System.out.println("redisson 락 걸기");
        try {
            boolean available = lock.tryLock(5, 2, TimeUnit.SECONDS);

            if (!available) {
                System.out.println("Lock 획득 실패");
                bidService.notifyUser(userId, "다른사람이 입찰 중입니다. 잠시 후 다시 시도하세요");
                return;
            }
            System.out.println("processBidWithRedis 진입");
            bidService.processBidWithRedis(auctionId, userId, bidAmount);  // BidService로 분리된 로직 호출

        } catch (InterruptedException e) {
            System.out.println("인터럽트 익셉션");
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}
