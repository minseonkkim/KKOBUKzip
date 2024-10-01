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

    // 경매 시작 로직... 그런데 어떻게 경매가 시작된줄 알 수 있을까?
    @Transactional
    public void startAuction(Long auctionId) {
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new AuctionNotFoundException("경매를 찾을 수 없습니다: " + auctionId));

        setAuctionEndTime(auctionId, LocalDateTime.now().plusSeconds(30));
        auction.updateStatus(AuctionProgress.DURING_AUCTION);
        System.out.println("경매 상태 변경 및 경매 종료시간 설정");
    }

    // 입찰 가격 갱신
    @Transactional
    public void processBidWithRedis(Long auctionId, Long userId, Double bidAmount) {
        startAuction(auctionId);
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new AuctionNotFoundException("경매를 찾을 수 없습니다."));
        String redisKey = AUCTION_BID_KEY + auctionId;

        // Redis 해시에서 현재 입찰 정보 가져오기
        Map<Object, Object> currentBidData = redisTemplate.opsForHash().entries(redisKey);

        Long currentUserId = null;
        Double currentBid = auction.getMinBid(); // 기본값은 경매 최소 입찰가

        if (!currentBidData.isEmpty()) {
            // Redis에 입찰 정보가 있는 경우 처리
            Object bidAmountObj = currentBidData.get("bidAmount");

            if (bidAmountObj instanceof String) {
                currentBid = Double.parseDouble((String) bidAmountObj);
                System.out.println("currentBid 스트링");
            } else if (bidAmountObj instanceof Double) {
                currentBid = (Double) bidAmountObj;
                System.out.println("currentBid 더블");
            }

            currentUserId = Long.parseLong(currentBidData.get("userId").toString());
            log.info("currentUserId: {}, currentBid: {}", currentUserId, currentBid);
        } else {
            // Redis에 데이터가 없는 경우, 최초 입찰 처리
            log.info("최초 입찰: auctionID = {}, minBid = {}", auctionId, currentBid);
        }

        // 경매 종료 시간 확인
        LocalDateTime auctionEndTime = getAuctionEndTime(auctionId);
        log.info("경매 종료 시간: {}", auctionEndTime);

        if (LocalDateTime.now().isAfter(auctionEndTime)) {
            notifyClient(auctionId, null, true, "입찰시간이 종료됐습니다");
            log.info("입찰 실패: auctionID{}, userId{}, bidAmount{}", auctionId, userId, bidAmount);
            return;
        }

        // 입찰가 계산
        Double bidIncrement = calculateBidIncrement(bidAmount);
        Double newBidAmount = bidAmount + bidIncrement;
        log.info("입찰가 증가: {} -> {}", bidAmount, newBidAmount);
        Double remainingTime = getAuctionRemainingTime(auctionId);
        System.out.println("Remaining Time : "+remainingTime);

        try {
            if (remainingTime == null) {
                throw new AuctionAlreadyFinishedException("경매가 이미 종료됐습니다");
            }

            // 동일 사용자가 재입찰 시 예외 처리
            if (currentUserId != null && currentUserId.equals(userId)) {
                throw new SameUserBidException("자신의 입찰에 재입찰할 수 없습니다: userId = " + userId);
            }

            // 현재 입찰가보다 낮은 금액으로 입찰할 경우 예외 처리
            if (bidAmount <= currentBid) {
                throw new WrongBidAmountException("현재 입찰가보다 낮거나 같은 금액으로 입찰할 수 없습니다: " +
                        "currentBid = " + currentBid + ", bidAmount = " + bidAmount);
            }

            // 최신 입찰 정보를 Redis 해시맵에 저장 (최신 값만 유지)
            Map<String, Object> bidData = new HashMap<>();
            bidData.put("userId", userId.toString());
            bidData.put("bidAmount", bidAmount.toString());
            bidData.put("nextBid", newBidAmount.toString());

            redisTemplate.opsForHash().putAll(redisKey, bidData);  // 최신 입찰 정보로 덮어쓰기
            System.out.println("userService에서 닉네임 가져오기");
            String userNickname = userService.getUserNicknameById(userId);
            log.info("userNickname: {}", userNickname);

            // 클라이언트에게 최신 입찰 정보 및 nextBid 정보 전송
            BidMessage bidRecord = BidMessage.builder()
                    .userId(userId)
                    .nickname(userNickname)
                    .auctionId(auctionId)
                    .bidAmount(bidAmount)
                    .nextBid(newBidAmount)
                    .remainingTime(remainingTime)
                    .build();

            notifyClient(auctionId, bidRecord, false, null);
            resetAuctionEndTime(auctionId);
            log.info("경매 종료 시간 TTL 재설정 완료");

            log.info("입찰 처리 완료: auctionID = {}, userId = {}, bidAmount = {}, nextBid = {}", auctionId, userId, bidAmount, newBidAmount);
        } catch (SameUserBidException | WrongBidAmountException e) {
            notifyClient(auctionId, null, true, e.getMessage());
            log.error("입찰 처리 실패: auctionID = {}, userId = {}, error: {}", auctionId, userId, e.getMessage());
        } catch (Exception e) {
            notifyClient(auctionId, null, true, "입찰 처리 중 예상치 못한 오류가 발생했습니다.");
            log.error("입찰 처리 실패: auctionID = {}, userId = {}, error: {}", auctionId, userId, e.getMessage());
        }
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
