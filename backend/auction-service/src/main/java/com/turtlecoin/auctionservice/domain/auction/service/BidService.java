package com.turtlecoin.auctionservice.domain.auction.service;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.domain.websocket.dto.BidMessage;
import com.turtlecoin.auctionservice.feign.dto.UserResponseDTO;
import com.turtlecoin.auctionservice.feign.service.UserService;
import com.turtlecoin.auctionservice.global.exception.AuctionAlreadyFinishedException;
import com.turtlecoin.auctionservice.global.exception.AuctionNotFoundException;
import com.turtlecoin.auctionservice.global.exception.SameUserBidException;
import com.turtlecoin.auctionservice.global.exception.WrongBidAmountException;
import com.turtlecoin.auctionservice.global.response.ResponseVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class BidService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final AuctionRepository auctionRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private static final String AUCTION_BID_KEY = "auction_bid_";
    private final UserService userService;
    private static final String AUCTION_END_KEY_PREFIX = "auction_end_";
    private final SseService sseService;

    // 경매 시작 로직... 그런데 어떻게 경매가 시작된줄 알 수 있을까?
    @Transactional
    public void startAuction(Long auctionId) {
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new AuctionNotFoundException("경매를 찾을 수 없습니다: " + auctionId));

        setAuctionEndTime(auctionId, LocalDateTime.now().plusSeconds(30));
        auction.updateStatus(AuctionProgress.DURING_AUCTION);
        
        // sse로 경매 시작을 알림
        sseService.notify(auction.getId(), "Auction Started");
        
        System.out.println("경매 상태 변경 및 경매 종료시간 설정");
    }

    // 입찰 가격 갱신
    @Transactional
    public void processBidWithRedis(Long auctionId, Long userId, Double bidAmount) {
        // 1. 경매 시작 및 상태 확인
        startAuctionIfNotStarted(auctionId);

        // 2. 현재 경매와 입찰 정보를 확인하고 유효성을 검증
        Auction auction = getAuction(auctionId);
        Long currentUserId = getCurrentBidUserId(auctionId, auction);
        Double currentBid = getCurrentBidAmount(auctionId, auction);

        // 3. 입찰 검증 로직
        validateBid(auctionId, userId, bidAmount, currentUserId, currentBid);

        // 4. 입찰 정보 갱신
        Double newBidAmount = updateBidInfo(auctionId, userId, bidAmount);

        // 5. 클라이언트에게 최신 입찰 정보 전송
        notifyClientWithBidInfo(auctionId, userId, bidAmount, newBidAmount);
    }

    private Auction getAuction(Long auctionId) {
        return auctionRepository.findById(auctionId)
                .orElseThrow(() -> new AuctionNotFoundException("경매를 찾을 수 없습니다."));
    }

    private void startAuctionIfNotStarted(Long auctionId) {
        Auction auction = getAuction(auctionId);
        if (auction.getAuctionProgress() == AuctionProgress.BEFORE_AUCTION) {
            startAuction(auctionId);
        }
    }

    private Long getCurrentBidUserId(Long auctionId, Auction auction) {
        String redisKey = AUCTION_BID_KEY + auctionId;
        Map<Object, Object> currentBidData = redisTemplate.opsForHash().entries(redisKey);
        if (!currentBidData.isEmpty()) {
            return Long.parseLong(currentBidData.get("userId").toString());
        }
        return null;  // 입찰자가 없으면 null 반환
    }

    private Double getCurrentBidAmount(Long auctionId, Auction auction) {
        String redisKey = AUCTION_BID_KEY + auctionId;
        Map<Object, Object> currentBidData = redisTemplate.opsForHash().entries(redisKey);
        Double currentBid = auction.getMinBid(); // 기본값은 경매 최소 입찰가
        if (!currentBidData.isEmpty()) {
            return parseBidAmount(currentBidData.get("bidAmount"));
        }
        return currentBid;
    }

    private Double parseBidAmount(Object bidAmountObj) {
        if (bidAmountObj instanceof String) {
            return Double.parseDouble((String) bidAmountObj);
        } else if (bidAmountObj instanceof Double) {
            return (Double) bidAmountObj;
        }
        throw new IllegalArgumentException("Invalid bid amount type");
    }

    private void validateBid(Long auctionId, Long userId, Double bidAmount, Long currentUserId, Double currentBid) {
        LocalDateTime auctionEndTime = getAuctionEndTime(auctionId);
        if (LocalDateTime.now().isAfter(auctionEndTime)) {
            notifyClient(auctionId, null, true, "입찰시간이 종료됐습니다");
            throw new AuctionAlreadyFinishedException("입찰 시간이 종료되었습니다.");
        }

        if (currentUserId != null && currentUserId.equals(userId)) {
            throw new SameUserBidException("자신의 입찰에 재입찰할 수 없습니다: userId = " + userId);
        }

        if (bidAmount <= currentBid) {
            throw new WrongBidAmountException("현재 입찰가보다 낮거나 같은 금액으로 입찰할 수 없습니다: currentBid = " +
                    currentBid + ", bidAmount = " + bidAmount);
        }
    }

    private Double updateBidInfo(Long auctionId, Long userId, Double bidAmount) {
        Double bidIncrement = calculateBidIncrement(bidAmount);
        Double newBidAmount = bidAmount + bidIncrement;

        String redisKey = AUCTION_BID_KEY + auctionId;
        Map<String, Object> bidData = new HashMap<>();
        bidData.put("userId", userId.toString());
        bidData.put("bidAmount", bidAmount.toString());
        bidData.put("nextBid", newBidAmount.toString());

        redisTemplate.opsForHash().putAll(redisKey, bidData);
        resetAuctionEndTime(auctionId);

        return newBidAmount;
    }

    private void notifyClientWithBidInfo(Long auctionId, Long userId, Double bidAmount, Double newBidAmount) {
        String userNickname = userService.getUserNicknameById(userId);
        log.info("userNickname: {}", userNickname);

        Double remainingTime = getAuctionRemainingTime(auctionId);
        BidMessage bidRecord = BidMessage.builder()
                .userId(userId)
                .nickname(userNickname)
                .auctionId(auctionId)
                .bidAmount(bidAmount)
                .nextBid(newBidAmount)
                .remainingTime(remainingTime)
                .build();

        notifyClient(auctionId, bidRecord, false, null);
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
            return 1000.0; // 0 ~ 10000 : 500
        } else if (currentBid >= 10001 && currentBid < 100000) {
            return 10000.0; // 10001 ~ 100000 : 2000
        } else if (currentBid >= 100001 && currentBid < 1000000) {
            return 20000.0; // 100001 ~ 200000 : 5000
        } else {
            return 30000.0; // 그 외 : 10000 (기본 값)
        }
    }

    public void notifyClient(Long auctionId, BidMessage bidMessage, boolean isError, String errorMessage) {
        ResponseVO<Object> response;
        if (isError) {
            // 에러가 발생한 경우
            response = ResponseVO.failure("500", errorMessage);
        } else {
            // 성공적인 입찰인 경우
            Map<String, Object> data = new HashMap<>();
            data.put("bidRecord", bidMessage);
            System.out.println("===");
            System.out.println(data.get("bidRecord").toString());
            System.out.println("===");
            response = ResponseVO.success("data", data);
        }

        // 클라이언트에게 ResponseVO 객체를 전송
        log.info("AuctionID: {} 에게 데이터 전송", auctionId);
        messagingTemplate.convertAndSend("/sub/auction/" + auctionId, response);
    }

    // 경매 종료 시간 설정 및 TTL 적용
    public void setAuctionEndTime(Long auctionId, LocalDateTime endTime) {
        String key = AUCTION_END_KEY_PREFIX + auctionId;
        String timeToString = endTime.toString();
        System.out.println("Key : "+key);
        System.out.println("Time To String : "+timeToString);
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        System.out.println("====여기서 오류 발생====");
        ops.set(key, timeToString, (long) (30.1*1000), TimeUnit.MILLISECONDS); // TTL 30초 설정
        System.out.println("endTime 시간 설정");
    }

    // 경매 종료 시간 갱신
    public void resetAuctionEndTime(Long auctionId) {
        String key = AUCTION_END_KEY_PREFIX + auctionId;
        redisTemplate.expire(key, (long) (30.1*1000), TimeUnit.MILLISECONDS); // TTL 30초 재설정
    }

    // 경매 종료 시간 조회
    public LocalDateTime getAuctionEndTime (Long auctionId) {
        String key = AUCTION_END_KEY_PREFIX + auctionId;
        Object endTimeObj = redisTemplate.opsForValue().get(key);
        if (endTimeObj instanceof String) {
            return LocalDateTime.parse((String) endTimeObj);
        }
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new AuctionNotFoundException("경매 시간을 찾을 수 없습니다."));
        return auction.getEndTime();
    }

    public Double getAuctionRemainingTime (Long auctionId) {
        String key = AUCTION_END_KEY_PREFIX + auctionId;
        Long remainingTime = redisTemplate.getExpire(key, TimeUnit.MILLISECONDS);

        if (remainingTime == null || remainingTime < 0) {
            return null;
        }
        return remainingTime.doubleValue();
    }
}
