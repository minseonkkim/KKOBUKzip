package com.turtlecoin.auctionservice;

import com.turtlecoin.auctionservice.domain.auction.facade.RedissonLockFacade;
import com.turtlecoin.auctionservice.domain.auction.service.AuctionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.mockito.Mockito.*;

@SpringBootTest
public class RedissonLockFacadeConcurrencyTest {

    @Autowired
    private RedissonLockFacade redissonLockFacade;

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private RedissonClient redissonClient;

    @BeforeEach
    void setUp() {
        // 테스트 실행 전에 필요한 설정 초기화
        Mockito.reset(auctionService, redissonClient);
    }

    @Test
    @Transactional
    public void testConcurrentBids() throws InterruptedException {
        int threadCount = 10;
        ExecutorService executorService = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(threadCount);

        Long auctionId = 1L;
        Double bidAmount = 1000.0;
        Long userId = 1L;

        for (int i = 0; i < threadCount; i++) {
            final int index = i;
            executorService.submit(() -> {
                try {
                    // 각 스레드에서 입찰 요청을 시도
                    redissonLockFacade.updateBidWithLock(auctionId, userId + index, bidAmount + (index * 100));
                } finally {
                    latch.countDown(); // 스레드 작업이 끝날 때마다 카운트를 줄임
                }
            });
        }

        latch.await(); // 모든 스레드가 끝날 때까지 대기

        // 최종적으로 auctionService의 메서드가 예상된 만큼 호출되었는지 검증
        verify(auctionService, times(threadCount)).processBidWithoutLock(anyLong(), anyLong(), anyDouble());
    }
}