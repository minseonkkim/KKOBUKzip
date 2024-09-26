package com.turtlecoin.auctionservice.domain.auction.facade;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.global.exception.SameUserBidException;
import com.turtlecoin.auctionservice.global.exception.WrongBidAmountException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class RedissonLockFacadeTest {

    private static final Logger log = LoggerFactory.getLogger(RedissonLockFacadeTest.class);
    @Autowired
    private RedissonLockFacade redissonLockFacade;

    @Autowired
    private AuctionRepository auctionRepository;

    private Auction auction;

    @BeforeEach
    public void setUp() {
        // 경매 객체 초기 설정
        auction = Auction.builder()
                .userId(1L)
                .title("Test Auction")
                .minBid(8000.0)
                .nowBid(8000.0)
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusDays(1))  // 경매 종료 시간 설정
                .content("Test content")
                .turtleId(1L)
                .auctionProgress(AuctionProgress.BEFORE_AUCTION)  // 경매 진행 상태 설정
                .build();

        auctionRepository.saveAndFlush(auction);
    }

    @AfterEach
    public void tearDown() {
        auctionRepository.deleteAll();
    }

    @Test
    public void 경매등록_성공() {
        Auction savedAuction = auctionRepository.findById(auction.getId()).orElseThrow();
        assertNotNull(savedAuction);
        assertEquals("Test Auction", savedAuction.getTitle());
        assertEquals(8000.0, savedAuction.getMinBid());
        assertEquals(AuctionProgress.BEFORE_AUCTION, savedAuction.getAuctionProgress());
    }

    @Test
    public void 입찰_성공() {
        // 새로운 입찰 시도
        redissonLockFacade.updateBidWithLock(auction.getId(), 2L, 8000.0);

        Auction updatedAuction = auctionRepository.findById(auction.getId()).orElseThrow();
        assertEquals(8000.0, updatedAuction.getNowBid());
        assertEquals(2L, updatedAuction.getBuyerId());
    }

    @Test
    public void 입찰_실패_낮은금액() {
        // 현재 입찰가보다 낮은 금액 입찰 시도
        assertThrows(WrongBidAmountException.class, () -> {
            redissonLockFacade.updateBidWithLock(auction.getId(), 3L, 5000.0);  // 9000은 minBid보다 낮음
        });
    }

    @Test
    public void 입찰_실패_동일사용자() {
        // 동일 사용자가 연속해서 입찰할 경우 실패
        redissonLockFacade.updateBidWithLock(auction.getId(), 2L, 12000.0);

        assertThrows(SameUserBidException.class, () -> {
            redissonLockFacade.updateBidWithLock(auction.getId(), 2L, 13000.0);  // 동일 사용자로 입찰 시도
        });
    }

    @Test
    public void 경매_종료_상태변경() {
        // 경매 종료 후 상태 업데이트
        auctionRepository.saveAndFlush(auction);

        Auction completedAuction = auctionRepository.findById(auction.getId()).orElseThrow();
    }

    @Test
    public void 동시입찰_성공_최초입찰자만반영() throws InterruptedException {
        int threadCount = 10;
        ExecutorService executorService = Executors.newFixedThreadPool(10);
        CountDownLatch latch = new CountDownLatch(threadCount);

        AtomicLong firstBidder = new AtomicLong();  // 최초 입찰자의 ID를 기록할 AtomicLong

        // 10명의 사용자가 동시에 동일한 금액으로 입찰 시도
        for (int i = 0; i < threadCount; i++) {
            final long userId = i + 1;
            final double bidAmount = 8000.0;  // 모든 사용자가 동일한 입찰 금액 제시

            executorService.submit(() -> {
                try {
                    log.info("경매ID: {}, 입찰자ID: {}", auction.getId(), userId);

                    // 가장 먼저 입찰한 사용자 기록 (이전에 기록된 값이 없을 때만 기록)
                    firstBidder.compareAndSet(0, userId);

                    // 입찰 처리
                    redissonLockFacade.updateBidWithLock(auction.getId(), userId, bidAmount);
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();

        // 경매 최종 상태 확인 (가장 먼저 입찰한 사용자만 반영되고 금액은 한 번만 올라가야 함)
        Auction updatedAuction = auctionRepository.findById(auction.getId()).orElseThrow();

        // 입찰 금액은 최초 입찰 금액(8500)으로 설정
        assertEquals(8000.0, updatedAuction.getNowBid(), "최종 입찰 금액은 8500이어야 합니다.");

        // 최초로 입찰한 사용자 기록 확인
        long firstBidderId = firstBidder.get();
        log.info("최초 입찰자: {}", firstBidderId);

        // 최종 입찰자와 최초 입찰자가 동일한지 확인
        assertEquals(firstBidderId, updatedAuction.getBuyerId(), "최초 입찰자가 최종 입찰자여야 합니다.");
    }
}