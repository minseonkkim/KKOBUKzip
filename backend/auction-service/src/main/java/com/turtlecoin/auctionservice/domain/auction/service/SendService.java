package com.turtlecoin.auctionservice.domain.auction.service;

import com.turtlecoin.auctionservice.domain.auction.dto.AuctionResultDTO;
import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.feign.service.UserService;
import com.turtlecoin.auctionservice.global.exception.AuctionNotFoundException;
import com.turtlecoin.auctionservice.global.response.ResponseVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SendService {
    private final RabbitTemplate rabbitTemplate;
    private final AuctionRepository auctionRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private static final String AUCTION_BID_KEY_PREFIX = "auction_bid_";
    private final RedisTemplate redisTemplate;
    private final UserService userService;

    @Value("${spring.rabbitmq.exchange}")
    private String auctionResultExchange;

    @Value("${spring.rabbitmq.routingKey}")
    private String auctionResultRoutingKey;


    public void sendAuctionResult (Object auctionResult) {
        rabbitTemplate.convertAndSend(auctionResultExchange, auctionResultRoutingKey, auctionResult);
    }

    public void sendMessage(AuctionResultDTO auctionResultDTO) {
        log.info("경매 종료 후 데이터 전송 시도");
        rabbitTemplate.convertAndSend("auction.result.exchange", "auction.result.key", auctionResultDTO);
        log.info("경매 종료 후 데이터 전송 완료");
    }

    // 경매 종료 알림, DB저장 로직
    @Transactional
    public void endAuction(Long auctionId) {
        ResponseVO<Object> response;
        Auction auction = auctionRepository.findById(auctionId).orElseThrow(() -> new AuctionNotFoundException("경매를 찾을 수 없습니다"));
        String redisBidKey = AUCTION_BID_KEY_PREFIX + auctionId;
        Map<Object, Object> bidData = redisTemplate.opsForHash().entries(redisBidKey);
        Map<String, Object> data = new HashMap<>();
        if (bidData.isEmpty()) {
            // 유찰 시키기
            auction.updateStatus(AuctionProgress.NO_BID);

//            AuctionResultDTO auctionResultDTO = createAuctionResultDTO(auction, null, null);
            data.put("bidAmount", 0);
            data.put("nickname", null);
            data.put("message", "경매가 유찰됐습니다.");

            response = ResponseVO.bidSuccess("End","205",data);
            messagingTemplate.convertAndSend("/sub/auction/" + auctionId, response);
            // rabbitmq로 보내기
//            sendMessage(auctionResultDTO);
            log.info("해당 경매에 입찰 기록이 없습니다: auctionId = {}", auctionId);
            return;
        }

        // 마지막 입찰가와 입찰자 ID 가져오기
        Double winningBid = Double.parseDouble(bidData.get("bidAmount").toString());
        Long winningUserId = Long.parseLong(bidData.get("userId").toString());
        String nickname = userService.getUserNicknameById(winningUserId);

        AuctionResultDTO auctionResultDTO = createAuctionResultDTO(auction, winningBid, winningUserId);



        data.put("bidAmount", winningBid);
        data.put("nickname", nickname);
        data.put("message", "경매가 낙찰됐습니다.");

        // 가격도 같이 보내주기
        response = ResponseVO.bidSuccess("End","201",data);

        auction.updateStatus(AuctionProgress.SUCCESSFUL_BID);
        auction.updateAfterAuction(winningUserId, winningBid);

        messagingTemplate.convertAndSend("/sub/auction/" + auctionId, response);
        // rabbitmq로 보내기
        sendMessage(auctionResultDTO);
        log.info("경매 종료 처리 완료: auctionId = {}", auctionId);
    }


    @Transactional
    public AuctionResultDTO createAuctionResultDTO(Auction auction, Double winningBid, Long buyerId) {
        System.out.println("사진 주소 가져오기 시도");

        // 트랜잭션 내에서 auctionPhotos를 초기화하여 Lazy Loading 문제 해결
        if (!auction.getAuctionPhotos().isEmpty()) {
            // auctionPhotos가 있을 경우, 첫 번째 사진 가져오기
            String firstImageAddress = auction.getAuctionPhotos().get(0).getImageUrl();
            System.out.println("사진 주소 가져오기 성공");

            return AuctionResultDTO.builder()
                    .title(auction.getTitle())
                    .content(auction.getContent())
                    .winningBid(winningBid)
                    .weight(auction.getWeight())
                    .turtleId(auction.getTurtleId())
                    .sellerAddress(auction.getSellerAddress())
                    .auctionFlag(true)
                    .buyerId(buyerId)
                    .sellerId(auction.getUserId())
                    .imageAddress(firstImageAddress) // 첫 번째 사진 주소 넣기
                    .build();
        } else {
            System.out.println("사진이 없습니다.");

            return AuctionResultDTO.builder()
                    .title(auction.getTitle())
                    .content(auction.getContent())
                    .winningBid(winningBid)
                    .weight(auction.getWeight())
                    .turtleId(auction.getTurtleId())
                    .sellerAddress(auction.getSellerAddress())
                    .auctionFlag(true)
                    .buyerId(buyerId)
                    .sellerId(auction.getUserId())
                    .imageAddress(null) // 사진이 없는 경우 null 처리
                    .build();
        }
    }
}
