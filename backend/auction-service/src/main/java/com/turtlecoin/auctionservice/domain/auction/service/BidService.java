package com.turtlecoin.auctionservice.domain.auction.service;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.domain.websocket.dto.BidMessage;
import com.turtlecoin.auctionservice.feign.dto.UserResponseDTO;
import com.turtlecoin.auctionservice.feign.service.UserService;
import com.turtlecoin.auctionservice.global.exception.*;
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

        String key = AUCTION_END_KEY_PREFIX + auctionId;

        redisTemplate.opsForValue().set(key, "ready");

        redisTemplate.expire(key, (long) (30.1*1000), TimeUnit.MILLISECONDS); // TTL 30초 설정

        Long remainingTime = redisTemplate.getExpire(key, TimeUnit.MILLISECONDS);
        auction.updateStatus(AuctionProgress.DURING_AUCTION);
        // sse로 경매 시작을 알림
        sseService.notify(auction.getId(), "Auction Started");
    }

    // 입찰 가격 갱신
    @Transactional
    public void processBidWithRedis(Long auctionId, Long userId, Double bidAmount)
            throws SameUserBidException, WrongBidAmountException, AuctionTimeNotValidException, AuctionAlreadyFinishedException, BidNotValidException {
        // 1. 경매 시작 및 상태 확인
//        startAuctionIfNotStarted(auctionId);

        // 2. 현재 경매와 입찰 정보를 확인하고 유효성을 검증
        Auction auction = getAuction(auctionId);

        if (auction.getUserId().equals(userId)) {
            throw new BidNotValidException("자신의 경매에 입찰할 수 없습니다");
        }

        Long currentUserId = getCurrentBidUserId(auctionId);
        // 최신 입찰가 가져오기
        Double currentBid = getCurrentBidAmount(auctionId, auction);

//        // 3. 입찰 검증 로직
        validateBid(auctionId, userId, bidAmount, currentUserId, currentBid);

        // 4. 입찰 정보 갱신
        Double newBidAmount = updateBidInfo(auctionId, userId, bidAmount);
        log.info("입찰 정보 갱신 완료");
        // 5. 클라이언트에게 최신 입찰 정보 전송
        notifyClientWithBidInfo(auctionId, userId, bidAmount, newBidAmount);
        log.info("클라이언트에게 입찰 정보 전송 완료");
    }

    private Auction getAuction(Long auctionId) {
        return auctionRepository.findById(auctionId)
                .orElseThrow(() -> new AuctionNotFoundException("경매를 찾을 수 없습니다."));
    }

    private void startAuctionIfNotStarted(Long auctionId) {
        Auction auction = getAuction(auctionId);
        if (auction.getAuctionProgress() == AuctionProgress.BEFORE_AUCTION) {
            log.info("경매 강제로 시작시키기");
            startAuction(auctionId);
            return;
        }
        log.info("경매 이미 진행중");
    }

    private Long getCurrentBidUserId(Long auctionId) {
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
        Double currentBid = 0D; // 기본값은 0원
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

    private void validateBid(Long auctionId, Long userId, Double bidAmount, Long currentUserId, Double currentBid)
        throws SameUserBidException, WrongBidAmountException, AuctionTimeNotValidException{
        // 경매 남은시간 확인
        log.info("경매 남은시간 검증 후 에러 던져주는 로직");
        String key = AUCTION_END_KEY_PREFIX + auctionId;
        Long remainingTime = redisTemplate.getExpire(key, TimeUnit.MILLISECONDS);
        log.info("redis key : {}remaining time : {}", key, remainingTime);
        if (currentUserId != null && currentUserId.equals(userId)) {
            String destination = "/user/" + userId + "/queue/auction";
            messagingTemplate.convertAndSendToUser(userId.toString(), destination,
                    ResponseVO.failure("Bid", "400", "자신의 입찰에 재입찰 할 수 없습니다."));
            throw new SameUserBidException("자신의 입찰에 재입찰할 수 없습니다: userId = " + userId);
        }

        if (bidAmount <= currentBid) {
            String destination = "/user/" + userId + "/queue/auction";
            messagingTemplate.convertAndSendToUser(userId.toString(), destination,
                    ResponseVO.failure("Bid", "400", "현재 입찰가보다 낮거나 같은 금액으로 입찰할 수 없습니다."));
            throw new WrongBidAmountException("현재 입찰가보다 낮거나 같은 금액으로 입찰할 수 없습니다: currentBid = " +
                    currentBid + ", bidAmount = " + bidAmount);
        }

        // 키가 만료됐으면
        if (remainingTime < 0) {
            String destination = "/user/" + userId + "/queue/auction";
            messagingTemplate.convertAndSendToUser(userId.toString(), destination,
                    ResponseVO.failure("Bid", "422", "입찰 가능한 시간이 아닙니다."));
            throw new AuctionTimeNotValidException("입찰 가능한 시간이 아닙니다.");
        } else {
            // 입찰시간 갱신
            redisTemplate.expire(key, (long) (30.1*1000), TimeUnit.MILLISECONDS); // TTL 30초 재설정
        }
    }

    private Double updateBidInfo(Long auctionId, Long userId, Double bidAmount) {
        log.info("입찰 갱신 로직 진입");
        Double bidIncrement = calculateBidIncrement(bidAmount);
        Double newBidAmount = bidAmount + bidIncrement;

        String redisKey = AUCTION_BID_KEY + auctionId;
        Map<String, Object> bidData = new HashMap<>();
        bidData.put("userId", userId.toString());
        bidData.put("remainingTime", redisTemplate.getExpire(redisKey, TimeUnit.MILLISECONDS).toString());
        bidData.put("bidAmount", bidAmount.toString());
        bidData.put("nextBid", newBidAmount.toString());

        redisTemplate.opsForHash().putAll(redisKey, bidData);

        // 마감시간 갱신하는 로직 검증할 때 갱신하도록 변경
//        resetAuctionEndTime(auctionId);
        log.info("경매 마감 시간 갱신");

        return newBidAmount;
    }

    private void notifyClientWithBidInfo(Long auctionId, Long userId, Double bidAmount, Double newBidAmount) {
        String userNickname = userService.getUserNicknameById(userId);
        log.info("입찰한 userNickname: {}", userNickname);

        String key = AUCTION_END_KEY_PREFIX + auctionId;

        Double remainingTime = (double) redisTemplate.getExpire(key, TimeUnit.MILLISECONDS);
        log.info("remaining time : {}", remainingTime);

        // 전송할 메시지에 담긴 bidRecord
        BidMessage bidRecord = BidMessage.builder()
                .userId(userId)
                .nickname(userNickname)
                .auctionId(auctionId)
                .bidAmount(bidAmount)
                .nextBid(newBidAmount)
                .remainingTime(remainingTime)
                .build();

        notifyClient(auctionId, bidRecord, false, null);
        log.info("클라이언트들에게 전송 완료");
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

    public Double calculateBidIncrement(Double currentBid) {
        // 경매 가격에 따라 구분
        if (currentBid >= 0 && currentBid <= 10000) {
            return 5000.0; // 0 ~ 10000 : 500
        } else if (currentBid > 10000 && currentBid <= 50000) {
            return 10000.0; // 10001 ~ 50000 : 1000
        } else if (currentBid > 50000 && currentBid <= 100000) {
            return 30000.0; // 50001 ~ 100000 : 5000
        } else if (currentBid > 100000 && currentBid <= 500000) {
            return 50000.0; // 100001 ~ 500000 : 10000
        } else if (currentBid > 500000 && currentBid <= 1000000) {
            return 70000.0; // 500001 ~ 1000000 : 20000
        } else if (currentBid > 1000000 && currentBid <= 5000000) {
            return 100000.0; // 1000001 ~ 5000000 : 50000
        } else if (currentBid > 5000000 && currentBid <= 10000000) {
            return 150000.0; // 5000001 ~ 10000000 : 100000
        } else {
            return 200000.0; // 10000001 이상 : 200000
        }
    }


    public void notifyClient(Long auctionId, BidMessage bidMessage, boolean isError, String errorMessage) {
        ResponseVO<Object> response;
        if (isError) {
            // 에러가 발생한 경우
            response = ResponseVO.failure("Bid","500", errorMessage);
        } else {
            // 성공적인 입찰인 경우
            Map<String, Object> data = new HashMap<>();
            data.put("bidRecord", bidMessage);
            response = ResponseVO.bidSuccess("Bid","200", data);
        }

        // 클라이언트에게 ResponseVO 객체를 전송
        log.info("AuctionID: {} 에게 데이터 전송", auctionId);
        messagingTemplate.convertAndSend("/sub/auction/" + auctionId, response);
    }

    public void notifyUser (Long userId, String message) {
        String destination = "/user/" + userId + "/queue/auction";
        messagingTemplate.convertAndSendToUser(userId.toString(), destination, message);
    }

    public void sendRemainingTimeToUser(Long userId, String auctionId, Long remainingTime) {
        // 특정 사용자에게만 WebSocket 경로로 남은 시간 전송
        String destination = "/user/" + userId + "/queue/auction/" + auctionId;
        messagingTemplate.convertAndSendToUser(userId.toString(), destination, "남은 시간: " + remainingTime + " ms");
    }

    // 경매 종료 시간 설정 및 TTL 적용
    public void setAuctionEndTime(Long auctionId, LocalDateTime endTime) {
        String key = AUCTION_END_KEY_PREFIX + auctionId;
        String timeToString = endTime.toString();
        ValueOperations<String, Object> ops = redisTemplate.opsForValue();
        ops.set(key, timeToString, (long) (30.1*1000), TimeUnit.MILLISECONDS); // TTL 30초 설정
    }

    // 경매 종료 시간 갱신
    public void resetAuctionEndTime(Long auctionId) {
        String key = AUCTION_END_KEY_PREFIX + auctionId;
        redisTemplate.expire(key, (long) (30.1*1000), TimeUnit.MILLISECONDS); // TTL 30초 재설정
    }

    // 경매 종료 시간 조회
//    public boolean getAuctionEndTime (Long auctionId) {
//        String key = AUCTION_END_KEY_PREFIX + auctionId;
//        Object endTimeObj = redisTemplate.opsForValue().get(key);
//        if (endTimeObj instanceof String) {
//            return LocalDateTime.parse((String) endTimeObj);
//        }
//        Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new AuctionNotFoundException("경매 시간을 찾을 수 없습니다."));
//        return auction.getEndTime();
//    }

    public Double getAuctionRemainingTime (Long auctionId) {
        String key = AUCTION_END_KEY_PREFIX + auctionId;
        Long remainingTime = redisTemplate.getExpire(key, TimeUnit.MILLISECONDS);

        if (remainingTime == null || remainingTime < 0) {
            return null;
        }
        return remainingTime.doubleValue();
    }
}
