package com.turtlecoin.auctionservice.domain.auction.controller;

import com.turtlecoin.auctionservice.domain.auction.dto.AuctionResponseDTO;
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
    @PostMapping
    public ResponseEntity<?> registerAuction(
            @RequestPart("data") RegisterAuctionDTO registerAuctionDTO,
            @RequestPart(value = "images", required = false) List<MultipartFile> multipartFiles) {
        try {
            // 경매 생성 및 이미지 처리
            auctionService.registerAuction(registerAuctionDTO, multipartFiles);
            log.info("경매 정보 저장 및 이미지 처리 완료");

            return new ResponseEntity<>(ResponseVO.success("경매 등록에 성공했습니다."), HttpStatus.OK);

        } catch (TurtleAlreadyRegisteredException e) {
            return new ResponseEntity<>(ResponseVO.failure("409", "이미 등록된 개체입니다."), HttpStatus.CONFLICT);

        } catch (AmqpConnectException e) {
            log.error("RabbitMQ 연결 실패: {}", e.getMessage());
            return new ResponseEntity<>(ResponseVO.success("RabbitMQ 오류 발생, 하지만 경매는 성공적으로 등록되었습니다.", "auction", null), HttpStatus.OK);

        } catch (IOException e) {
            log.info("IOException 발생");
            return new ResponseEntity<>(ResponseVO.failure("400", "경매 등록에 실패했습니다. " + e.getMessage()), HttpStatus.BAD_REQUEST);

        } catch (NumberFormatException e) {
            // 숫자 형식이 잘못된 경우 예외 처리
            return new ResponseEntity<>(ResponseVO.failure("400", "잘못된 형식의 입력값이 있습니다."), HttpStatus.BAD_REQUEST);

        } catch (IllegalArgumentException e) {
            // 기타 잘못된 인자 처리
            return new ResponseEntity<>(ResponseVO.failure("400", "잘못된 파라미터입니다."), HttpStatus.BAD_REQUEST);

        } catch (MultipartException e) {
            // Multipart 관련 예외 처리
            log.error("MultipartException 발생: {}", e.getMessage());
            return new ResponseEntity<>(ResponseVO.failure("400", "잘못된 요청입니다. multipart/form-data 형식으로 요청해주세요."), HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            log.info("기타 오류 발생");
            return new ResponseEntity<>(ResponseVO.failure("500", "서버 내부 오류가 발생했습니다. " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
        List<AuctionResponseDTO> auctionDTOs = auctionService.getFilteredAuctions(gender, minSize, maxSize, minPrice, maxPrice, progress, page)
                .stream()
                .map(auctionService::convertToDTO)
                .toList();

        return new ResponseEntity<>(ResponseVO.success("경매 목록 조회에 성공했습니다.", "auctions", auctionDTOs), HttpStatus.OK);
    }

    @GetMapping("/{auctionId}")
    public ResponseEntity<?> getAuctionById(@PathVariable Long auctionId) {
        log.info("경매 ID : {}", auctionId);

        try {
            AuctionResponseDTO responseDTO = auctionService.getAuctionById(auctionId);
            return new ResponseEntity<>(ResponseVO.success("경매 조회에 성공했습니다", "auction", responseDTO), HttpStatus.OK);

        } catch (AuctionNotFoundException e) {
            log.error("경매를 찾을 수 없습니다: {}", auctionId, e);
            return new ResponseEntity<>(ResponseVO.failure("404", "경매를 찾을 수 없습니다."), HttpStatus.NOT_FOUND);

        } catch (Exception e) {
            log.error("기타 에러 발생: {}", e.getMessage(), e);
            return new ResponseEntity<>(ResponseVO.failure("400", "에러가 발생했습니다."), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{auctionId}/test")
    public void test(@PathVariable Long auctionId) {
        bidService.startAuction(auctionId);
    }
}

