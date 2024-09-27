package com.turtlecoin.auctionservice.domain.auction.controller;

import com.turtlecoin.auctionservice.domain.auction.dto.BidRequestDTO;
import com.turtlecoin.auctionservice.domain.auction.service.AuctionService;
import com.turtlecoin.auctionservice.domain.websocket.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping
public class BidController {

    private final AuctionService auctionService;
    private final WebSocketService webSocketService;

    @MessageMapping("/{auctionId}/bid")
    public void processBid(@DestinationVariable Long auctionId, BidRequestDTO bidRequestDTO) {
        auctionService.processBid(auctionId, bidRequestDTO.getUserId(), bidRequestDTO.getBidAmount());
        webSocketService.sendBidUpdate(auctionId, bidRequestDTO.getUserId(), bidRequestDTO.getBidAmount());
    }

//    @PostMapping("/{auctionId}/bid")
//    public ResponseEntity<ResponseVO<?>> auctionBid(@PathVariable Long auctionId, @RequestBody BidRequestDTO bidRequestdto) {
//        Double newBidAmount = bidRequestdto.getBidAmount();
//        Long userId = bidRequestdto.getUserId();
//
//        try {
//            auctionService.processBid(auctionId, userId, newBidAmount);
//            return new ResponseEntity<>(ResponseVO.success("입찰에 성공했습니다."), HttpStatus.OK);
//        } catch (SameUserBidException e) {
//            return new ResponseEntity<>(ResponseVO.failure("400", "자신의 입찰에 재입찰 할 수 없습니다."), HttpStatus.BAD_REQUEST);
//        } catch (WrongBidAmountException e) {
//            return new ResponseEntity<>(ResponseVO.failure("400", "현재 입찰가가 더 높습니다."), HttpStatus.BAD_REQUEST);
//        } catch (AuctionNotFoundException e) {
//            return new ResponseEntity<>(ResponseVO.failure("404", "경매를 찾을 수 없습니다."), HttpStatus.NOT_FOUND);
//        } catch (Exception e) {
//            return new ResponseEntity<>(ResponseVO.failure("500", "서버 내부 오류가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
}
