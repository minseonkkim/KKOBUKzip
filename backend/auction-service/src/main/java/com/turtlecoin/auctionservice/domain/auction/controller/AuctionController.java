package com.turtlecoin.auctionservice.domain.auction.controller;

import com.turtlecoin.auctionservice.domain.auction.dto.AuctionResultDTO;
import com.turtlecoin.auctionservice.domain.auction.dto.RegisterAuctionDTO;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.domain.auction.service.AuctionService;
import com.turtlecoin.auctionservice.domain.auction.service.BidService;
import com.turtlecoin.auctionservice.domain.auction.service.SchedulingService;
import com.turtlecoin.auctionservice.domain.auction.service.SseService;
import com.turtlecoin.auctionservice.domain.s3.service.ImageUploadService;
import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import com.turtlecoin.auctionservice.global.exception.*;
import com.turtlecoin.auctionservice.global.response.ResponseVO;
import com.turtlecoin.auctionservice.global.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpConnectException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auction")
public class AuctionController {

    private final ImageUploadService imageUploadService;
    private final AuctionService auctionService;
    private final BidService bidService;
    private final AuctionRepository auctionRepository;
    private final SchedulingService schedulingService;
    private final SseService sseService;
    private final JWTUtil jwtUtil;

    // 테스트
    @GetMapping("/test")
    public ResponseEntity<String> test () {
        log.info("test");
        System.out.println("test!");
//        sendService.sendMessage();
        return ResponseEntity.status(HttpStatus.OK).body("OK");
    }

    // SSE 연결
    @GetMapping(value = "/sse/subscribe/{id}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@PathVariable Long id) {
        return sseService.subscribe(id);
    }

    // SSE 보내기 테스트
    @PostMapping(value = "/sse/{id}")
    public void sendSSE(@PathVariable Long id, @RequestBody Map<String, String> request) {
        sseService.notify(id, request.get("message"));
    }

    // 경매 등록
    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> registerAuction(
            @RequestPart("data") RegisterAuctionDTO registerAuctionDTO,
            @RequestPart(value = "images", required = false) List<MultipartFile> multipartFiles) {
            // 경매 생성 및 이미지 처리
            return auctionService.registerAuction(registerAuctionDTO, multipartFiles);
    }

    @GetMapping
    public ResponseEntity<?> getAuctions(
            @RequestParam(value = "gender", required = false) Gender gender,
            @RequestParam(value = "minSize", required = false) Double minSize,
            @RequestParam(value = "maxSize", required = false) Double maxSize,
            @RequestParam(value = "minPrice", required = false) Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "progress", required = false) AuctionProgress progress,
            @RequestParam(value = "page", defaultValue = "0") int page
    ) {
        return auctionService.getFilteredAuctions(gender, minSize, maxSize, minPrice, maxPrice, progress, page);
    }

    @GetMapping("/{auctionId}")
    public ResponseEntity<?> getAuctionById(@PathVariable Long auctionId) {
        return auctionService.getAuctionById(auctionId);
    }

    @GetMapping("/{auctionId}/test")
    public void test(@PathVariable Long auctionId) {
        bidService.startAuction(auctionId);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyAuctions(@RequestHeader("Authorization") String token) {
        try{
            Long id = jwtUtil.getIdFromToken(token.split(" ")[1]);
            System.out.println(id);
            if(id == null) {
                throw new UserNotFoundException("유효한 토큰 값이 아닙니다.");
            }

            List<AuctionResultDTO> data = auctionService.getMyAuctions(id);
            System.out.println(data.toString());
            return new ResponseEntity<>(ResponseVO.success("내 경매 조회에 성공하였습니다.", "data", data), HttpStatus.OK);
        }catch (IOException e){
            return new ResponseEntity<>(ResponseVO.failure("500", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }catch(UserNotFoundException e){
            return new ResponseEntity<>(ResponseVO.failure("401", e.getMessage()), HttpStatus.UNAUTHORIZED);
        }catch(Exception e){
            return new ResponseEntity<>(ResponseVO.failure("500", "내 경매 조회 중 예상치 못한 에러가 발생하였습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }

}

