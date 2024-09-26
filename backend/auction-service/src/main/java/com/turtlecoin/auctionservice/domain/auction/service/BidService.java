package com.turtlecoin.auctionservice.domain.auction.service;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.global.exception.AuctionNotFoundException;
import com.turtlecoin.auctionservice.global.exception.SameUserBidException;
import com.turtlecoin.auctionservice.global.exception.WrongBidAmountException;
import com.turtlecoin.auctionservice.global.response.ResponseVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class BidService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final AuctionRepository auctionRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private static final String AUCTION_BID_KEY = "auction_bid_";

    // 입찰 가격 갱신
    @Transactional
    public void processBidWithRedis(Long auctionId, Long userId, Double bidAmount) {
        String redisKey = AUCTION_BID_KEY + auctionId + ":history";

        // Redis에서 현재 입찰가와 입찰자 정보 가져오기
        List<Object> bidHistory = redisTemplate.opsForList().range(redisKey, 0, -1);
        Long currentUserId = null;
        Double currentBid = null;

        if (bidHistory != null && !bidHistory.isEmpty()) {
            String latestBidRecord = (String) bidHistory.get(0);
            currentUserId = Long.parseLong(latestBidRecord.split(":")[1]);
            currentBid = Double.parseDouble(latestBidRecord.split(":")[2]);
        }

        LocalDateTime auctionEndTime = getAuctionEndTime(auctionId);

        if (LocalDateTime.now().isAfter(auctionEndTime)) {
            notifyClient(auctionId, null, true, "입찰시간이 종료됐습니다");
            log.info("입찰 실패: auctionID{}, userId{}, bidAmount{}", auctionId, userId, bidAmount);
            return;
        }

        // 입찰가 계산
        Double bidIncrement = calculateBidIncrement(bidAmount);
        Double newBidAmount = bidAmount + bidIncrement;

        try {
            // 동일 사용자가 재입찰 시 예외 처리
            if (currentUserId != null && currentUserId.equals(userId)) {
                throw new SameUserBidException("자신의 입찰에 재입찰할 수 없습니다: userId = " + userId);
            }

            // 현재 입찰가보다 낮은 금액으로 입찰할 경우 예외 처리
            if (newBidAmount <= currentBid) {
                throw new WrongBidAmountException("현재 입찰가보다 낮은 금액으로 입찰할 수 없습니다: " +
                        "currentBid = " + currentBid + ", bidAmount = " + newBidAmount);
            }

            String bidRecord = "auctionId: " + auctionId + ", userId: " + userId + ", bidAmount: " + newBidAmount;
//            redisTemplate.opsForList()

            // Redis에 새로운 입찰 정보 저장
            Map<String, Object> bidData = new HashMap<>();
            bidData.put("userId", userId);
            bidData.put("bidAmount", newBidAmount);
            redisTemplate.opsForHash().putAll(redisKey, bidData);

            Auction auction = auctionRepository.findById(auctionId)
                    .orElseThrow(() -> new AuctionNotFoundException("경매를 찾을 수 없습니다."));
            auction.updateEndTime();
//            (auctionId, LocalDateTime.now().plusSeconds(30));

            // 입찰 기록 로그에 저장 (optional)
            redisTemplate.opsForList().rightPush(redisKey + ":history", bidRecord);

            // 클라이언트에게 실시간 입찰 정보 전송
            notifyClient(auctionId, bidRecord, false, null);

            log.info("입찰 처리 완료: auctionID = {}, userId = {}, bidAmount = {}", auctionId, userId, newBidAmount);
        } catch (Exception e) {
            notifyClient(auctionId, null, true, e.getMessage());
            log.error("입찰 처리 실패: auctionID = {}, userId = {}, error: {}", auctionId, userId, e.getMessage());
        }


        // 입찰 기록 생성

    }

//    private void updateAuctionEndTime(Long auctionId, LocalDateTime localDateTime) {
//        Auction auction = auctionRepository.findById(auctionId)
//                .orElseThrow(() -> new AuctionNotFoundException("경매를 찾을 수 없습니다."));
//
//        auction
//    }


    public Map<Object, Object> getCurrentBid (Long auctionId) {
        String redisKey = AUCTION_BID_KEY + auctionId;
        return redisTemplate.opsForHash().entries(redisKey);
    }

    public Double getMinBid(Long auctionId) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new AuctionNotFoundException("경매를 찾을 수 없습니다."));
        return auction.getMinBid();
    }

    private Double calculateBidIncrement(Double currentBid) {
        // 경매 가격에 따라 구분 필요
        if (currentBid >= 0 && currentBid < 10000) {
            return 500.0; // 0 ~ 10000 : 500
        } else if (currentBid >= 10001 && currentBid < 100000) {
            return 2000.0; // 10001 ~ 100000 : 2000
        } else if (currentBid >= 100001 && currentBid < 200000) {
            return 5000.0; // 100001 ~ 200000 : 5000
        } else {
            return 10000.0; // 그 외 : 10000 (기본 값)
        }
    }

    public void notifyClient(Long auctionId, String bidRecord, boolean isError, String errorMessage) {
        ResponseVO<String> response;
        if (isError) {
            // 에러가 발생한 경우
            response = ResponseVO.failure("500", errorMessage);
        } else {
            // 성공적인 입찰인 경우
            response = ResponseVO.success("Bid successful", "bidRecord", bidRecord);
        }
        // 클라이언트에게 ResponseVO 객체를 전송
        messagingTemplate.convertAndSend("/auction/topic/" + auctionId, response);
    }

    public LocalDateTime getAuctionEndTime(Long auctionId) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new AuctionNotFoundException("경매를 찾을 수 없습니다."+auctionId));
        return auction.getEndTime();
    }
}
