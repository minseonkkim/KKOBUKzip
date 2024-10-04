package com.turtlecoin.auctionservice.domain.websocket.controller;

import com.turtlecoin.auctionservice.domain.auction.facade.RedissonLockFacade;
import com.turtlecoin.auctionservice.domain.auction.service.BidService;
import com.turtlecoin.auctionservice.domain.websocket.dto.BidMessage;
import com.turtlecoin.auctionservice.feign.MainClient;
import com.turtlecoin.auctionservice.feign.dto.UserResponseDTO;
import com.turtlecoin.auctionservice.global.exception.*;
import com.turtlecoin.auctionservice.global.response.ResponseVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class AuctionWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final RedissonLockFacade redissonLockFacade;
    private final MainClient mainClient;
//    private final BidService bidService;

    // 클라이언트가 특정 경매에 입찰을 보낼 때 (/pub/auction/{auctionId}/bid)
    @MessageMapping("/auction/{auctionId}/bid")
    public void handleBid(@DestinationVariable Long auctionId, BidMessage bidMessage) {
        Long userId = bidMessage.getUserId();
        Double bidAmount = bidMessage.getBidAmount();
        Double nextBid = bidMessage.getNextBid();

        try {
            redissonLockFacade.updateBidWithLock(auctionId, userId, bidAmount);
            log.info("입찰이 성공적으로 처리되었습니다: auctionId = {}, userId = {}, bidAmount = {}", auctionId, userId, bidAmount);
        } catch (BidConcurrencyException e) {
            log.error("경매를 찾을 수 없습니다: auctionId = {}, userId = {}", auctionId, userId, e);
            String destination = "/user/" + userId + "/queue/auction";
            messagingTemplate.convertAndSendToUser(userId.toString(), destination,
                    ResponseVO.failure("409", "다른 사람이 입찰 중입니다. 잠시 후 다시 시도하세요."));
        } catch (AuctionNotFoundException e) {
            log.error("경매를 찾을 수 없습니다: auctionId = {}, userId = {}", auctionId, userId, e);
            messagingTemplate.convertAndSend("/sub/auction/" + auctionId,
                    ResponseVO.failure("404", "해당 경매를 찾을 수 없습니다."));
        } catch (SameUserBidException e) {
            log.error("동일 사용자의 재입찰 시도: auctionId = {}, userId = {}", auctionId, userId, e);
            messagingTemplate.convertAndSend("/sub/auction/" + auctionId,
                    ResponseVO.failure("400", e.getMessage()));
        } catch (AuctionAlreadyFinishedException e) {
            log.error("이미 종료된 경매: auctionId = {}, userId = {}, bidAmount = {}", auctionId, userId, bidAmount, e);
            messagingTemplate.convertAndSend("/sub/auction/" + auctionId,
                    ResponseVO.failure("400", e.getMessage()));
        } catch (WrongBidAmountException e) {
            log.error("잘못된 입찰 금액: auctionId = {}, userId = {}, bidAmount = {}", auctionId, userId, bidAmount, e);
            messagingTemplate.convertAndSend("/sub/auction/" + auctionId,
                    ResponseVO.failure("400", e.getMessage()));
        } catch (Exception e) {
            log.error("입찰 처리 중 예상치 못한 오류 발생: auctionId = {}, userId = {}", auctionId, userId, e);
            messagingTemplate.convertAndSend("/sub/auction/" + auctionId,
                    ResponseVO.failure("500", "입찰 처리 중 오류가 발생했습니다."));
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
