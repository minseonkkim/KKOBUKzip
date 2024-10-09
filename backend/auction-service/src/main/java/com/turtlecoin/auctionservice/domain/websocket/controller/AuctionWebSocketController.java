package com.turtlecoin.auctionservice.domain.websocket.controller;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.facade.RedissonLockFacade;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.domain.auction.service.BidService;
import com.turtlecoin.auctionservice.domain.websocket.dto.BidMessage;
import com.turtlecoin.auctionservice.feign.MainClient;
import com.turtlecoin.auctionservice.feign.dto.UserResponseDTO;
import com.turtlecoin.auctionservice.global.exception.*;
import com.turtlecoin.auctionservice.global.response.ResponseVO;
import com.turtlecoin.auctionservice.global.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Controller
@RequiredArgsConstructor
public class AuctionWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final RedissonLockFacade redissonLockFacade;
    private final MainClient mainClient;
    private final RedisTemplate redisTemplate;
    private static final String AUCTION_END_KEY_PREFIX = "auction_end_";
    private static final String AUCTION_BID_KEY = "auction_bid_";
    private final AuctionRepository auctionRepository;
    private final JWTUtil jwtUtil;
//    private final BidService bidService;

    @MessageMapping("/auction/{auctionId}/init")
    public void sendInitialData(@DestinationVariable Long auctionId, Principal principal) {
        System.out.println("Initial Data 진입");
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new AuctionNotFoundException("경매가 존재하지 않습니다."));
        String bidKey = AUCTION_BID_KEY+auctionId;
        String endKey = AUCTION_END_KEY_PREFIX+auctionId;

        Long userId = Long.valueOf(principal.getName());

        System.out.println("Principal에서 userId : "+userId);

        if (!redisTemplate.hasKey(bidKey)) {
            log.warn("Redis에 키가 존재하지 않습니다. 기본값을 사용합니다.");

            // 기본값으로 처리
            Double nowBid = 0D; // 기본값

            // 필요한 데이터를 초기화
            Map<String, Object> initialData = new HashMap<>();
            initialData.put("bidAmount", nowBid);

            // 클라이언트에게 데이터 전송
            String destination = "/queue/auction/" + auctionId + "/init";
            System.out.println("DESTINATION: "+destination);


            messagingTemplate.convertAndSendToUser(userId.toString(), destination,
                    ResponseVO.bidSuccess("Join", "200", "HIHI!!"));

        // /user/{userId}/queue/auction/{auctionId}/init
            messagingTemplate.convertAndSendToUser(userId.toString(), destination,
                    ResponseVO.bidSuccess("Join", "200", initialData));

            log.info("기본값을 사용하여 유저에게 데이터 전송 완료: userId={}, auctionId={}", userId, auctionId);
        } else {
            // 키가 있는 경우, Redis에서 값을 가져옵니다.
            log.info("Redis에 키가 존재합니다. Redis에서 정보를 가져옵니다.");

            Object bidAmountObj = redisTemplate.opsForHash().get(bidKey, "bidAmount");
            Double nowBid = (bidAmountObj != null) ? Double.parseDouble(bidAmountObj.toString()) : 0D;
            Object nextBidObj = redisTemplate.opsForHash().get(bidKey, "nextBid");
            Double nextBid = (nextBidObj != null) ? Double.parseDouble(nextBidObj.toString()) : 0D;

            // 필요한 데이터 조회 및 응답 처리
            Map<String, Object> initialData = new HashMap<>();
            initialData.put("bidAmount", nowBid);
            initialData.put("nextBid", nextBid);

            // 클라이언트에게 데이터 전송
            String destination = "/queue/auction/" + auctionId + "/init";
            messagingTemplate.convertAndSendToUser(principal.getName(), destination,
                    ResponseVO.bidSuccess("Join", "200", initialData));

            log.info("유저에게 데이터 전송 완료: userId={}, auctionId={}", userId, auctionId);
        }
    }

    // 클라이언트가 특정 경매에 입찰을 보낼 때 (/pub/auction/{auctionId}/bid)
    @MessageMapping("/auction/{auctionId}/bid")
    public void handleBid(@DestinationVariable Long auctionId, BidMessage bidMessage) {
        Long userId = bidMessage.getUserId();
        Double bidAmount = bidMessage.getBidAmount();
        log.info("Bid Amount: {}", bidAmount);
        Double nextBid = bidMessage.getNextBid();

        try {
            redissonLockFacade.updateBidWithLock(auctionId, userId, bidAmount);
            log.info("입찰이 성공적으로 처리되었습니다: auctionId = {}, userId = {}, bidAmount = {}", auctionId, userId, bidAmount);
        } catch (BidConcurrencyException e) {
            log.error("경매를 찾을 수 없습니다: auctionId = {}, userId = {}", auctionId, userId, e);
            String destination = "/user/" + userId + "/queue/auction";
            messagingTemplate.convertAndSendToUser(userId.toString(), destination,
                    ResponseVO.failure("Bid","409", "다른 사람이 입찰 중입니다. 잠시 후 다시 시도하세요."));
        } catch (AuctionNotFoundException e) {
            log.error("경매를 찾을 수 없습니다: auctionId = {}, userId = {}", auctionId, userId, e);
            String destination = "/user/" + userId + "/queue/auction";
            messagingTemplate.convertAndSendToUser(userId.toString(), destination,
                    ResponseVO.failure("Bid", "404", "해당 경매를 찾을 수 없습니다."));
        } catch (SameUserBidException e) {
            log.error("동일 사용자의 재입찰 시도: auctionId = {}, userId = {}", auctionId, userId, e);
            String destination = "/user/" + userId + "/queue/auction";
            messagingTemplate.convertAndSendToUser(userId.toString(), destination,
                    ResponseVO.failure("Bid", "400", "자신의 입찰에 재입찰 할 수 없습니다."));
        } catch (AuctionTimeNotValidException e) {
          log.error("경매 시간이 아님. auctionId = {}, userId = {}", auctionId, userId, e);
            String destination = "/user/" + userId + "/queue/auction";
            messagingTemplate.convertAndSendToUser(userId.toString(), destination,
                    ResponseVO.failure("Bid", "422", "입찰 가능한 시간이 아닙니다."));
        } catch (AuctionAlreadyFinishedException e) {
            log.error("이미 종료된 경매: auctionId = {}, userId = {}, bidAmount = {}", auctionId, userId, bidAmount, e);
            String destination = "/user/" + userId + "/queue/auction";
            messagingTemplate.convertAndSendToUser(userId.toString(), destination,
                    ResponseVO.failure("Bid", "400", "이미 종료된 경매입니다."));
        } catch (WrongBidAmountException e) {
            log.error("잘못된 입찰 금액: auctionId = {}, userId = {}, bidAmount = {}", auctionId, userId, bidAmount, e);
            String destination = "/user/" + userId + "/queue/auction";
            messagingTemplate.convertAndSendToUser(userId.toString(), destination,
                    ResponseVO.failure("Bid", "400", "현재 입찰가보다 낮거나 같은 금액으로 입찰할 수 없습니다."));
        } catch (Exception e) {
            log.error("입찰 처리 중 예상치 못한 오류 발생: auctionId = {}, userId = {}", auctionId, userId, e);
            String destination = "/user/" + userId + "/queue/auction";
            messagingTemplate.convertAndSendToUser(userId.toString(), destination,
                    ResponseVO.failure("Bid", "500", e.getMessage()));
        }
    }

    public void sendNicknameOnConnect(String userId) {
        // 메인 서비스에서 유저 정보를 가져와서 nickname 전송
        UserResponseDTO user = mainClient.getUserById(Long.parseLong(userId));
        if (user != null) {
            messagingTemplate.convertAndSend("/sub/auction/nickname", user.getNickname());
            log.info("닉네임 전송: {}", user.getNickname());
        }
    }

}
