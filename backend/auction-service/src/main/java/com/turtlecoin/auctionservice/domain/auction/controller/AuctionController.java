package com.turtlecoin.auctionservice.domain.auction.controller;

import com.turtlecoin.auctionservice.domain.auction.dto.AuctionResponseDTO;
import com.turtlecoin.auctionservice.domain.auction.dto.BidRequestDTO;
import com.turtlecoin.auctionservice.domain.auction.dto.RegisterAuctionDTO;
import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionPhoto;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.domain.auction.service.AuctionService;
import com.turtlecoin.auctionservice.domain.s3.service.ImageUploadService;
import com.turtlecoin.auctionservice.feign.dto.TurtleResponseDTO;
import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import com.turtlecoin.auctionservice.domain.turtle.service.TurtleService;
import com.turtlecoin.auctionservice.global.exception.AuctionNotFoundException;
import com.turtlecoin.auctionservice.global.response.ResponseVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpConnectException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auction")
public class AuctionController {

    private final TurtleService turtleService;
    private final ImageUploadService imageUploadService;

    //거북이 정보 조회
    @GetMapping("/info")
    public TurtleResponseDTO getTurtleInfo() {
        // turtleId는 1로 고정
        Long turtleId = 1L;
        return turtleService.getTurtleInfo(turtleId);
    }

    private final AuctionService auctionService;
    private final AuctionRepository auctionRepository;

    // 테스트
    @GetMapping("/test")
    public ResponseEntity<String> test () {
        log.info("test");
        System.out.println("test!");

        return ResponseEntity.status(HttpStatus.OK).body("OK");
    }

    // 경매 등록
    @PostMapping
    public ResponseEntity<ResponseVO<?>> registerAuction(
            @RequestPart("data") RegisterAuctionDTO registerAuctionDTO,
            @RequestPart(value = "images", required = false) List<MultipartFile> multipartFiles) {
        log.info("Registering auction {}", registerAuctionDTO);
        try {
            // 경매 생성
            Auction registeredAuction = auctionService.registerAuction(registerAuctionDTO, multipartFiles);
            log.info("경매 정보 저장");

            AuctionResponseDTO responseDTO = auctionService.convertToDTO(registeredAuction);
            log.info("경매 정보 DTO로 변환 완료");



            // 이미지가 있다면 처리
            if (multipartFiles != null && !multipartFiles.isEmpty()) {
                for (MultipartFile file : multipartFiles) {
                    String imagePath = imageUploadService.upload(file, "auctionImages"); // 이미지 업로드 후 경로 반환

                    // AuctionPhoto 엔티티 생성 후 Auction과 연결
                    AuctionPhoto auctionPhoto = AuctionPhoto.builder()
                            .imageAddress(imagePath)
                            .auction(registeredAuction)  // 경매와 연결
                            .build();

                    registeredAuction.getAuctionPhotos().add(auctionPhoto);  // Auction 엔티티에 추가
                }
            }

            // 경매 및 사진 정보 저장
            auctionRepository.save(registeredAuction);
            log.info("이미지 및 경매 정보 저장 완료");

            return new ResponseEntity<>(ResponseVO.success("경매 등록에 성공했습니다."), HttpStatus.OK);

        } catch (AmqpConnectException e) {
            log.error("RabbitMQ 연결 실패: {}", e.getMessage());
            return new ResponseEntity<>(ResponseVO.success("RabbitMQ 오류 발생, 하지만 경매는 성공적으로 등록되었습니다.", "auction", null), HttpStatus.OK);

        } catch (IOException e) {
            log.info("IOException 발생");
            return new ResponseEntity<>(ResponseVO.failure("400", "경매 등록에 실패했습니다. " + e.getMessage()), HttpStatus.BAD_REQUEST);
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
            @RequestParam(value = "page", defaultValue = "1") int page
    ) {
        List<AuctionResponseDTO> auctionDTOs = auctionService.getFilteredAuctions(gender, minSize, maxSize, minPrice, maxPrice, progress, page)
                .stream()
                .map(auctionService::convertToDTO)
                .toList();

        return new ResponseEntity<>(ResponseVO.success("경매 목록 조회에 성공했습니다.", "auctions", auctionDTOs), HttpStatus.OK);
    }

    @GetMapping("/{auctionId}")
    public ResponseEntity<ResponseVO<AuctionResponseDTO>> getAuctionById(@PathVariable Long auctionId) {
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


    @PostMapping("/{auctionId}/bid")
    public ResponseEntity<ResponseVO<String>> auctionBid(@PathVariable Long auctionId, @RequestBody BidRequestDTO bidRequestdto) {
        Long newBidAmount = bidRequestdto.getBidAmount();
        Long userId = bidRequestdto.getUserId();

        Map<Object, Object> currentBidData = auctionService.getCurrentBid(auctionId);
        Long currentBid = (Long) currentBidData.get("nowBid");
        Long currentUserId = (Long) currentBidData.get("userId");

        if ((currentBid == null || newBidAmount > currentBid) &&
                (currentUserId == null || !currentUserId.equals(userId))) {
            auctionService.updateBid(auctionId, currentUserId, newBidAmount);
            return new ResponseEntity<>(ResponseVO.success("입찰에 성공했습니다."), HttpStatus.OK);
        } else if (currentUserId != null && currentUserId.equals(userId)) {
            return new ResponseEntity<>(ResponseVO.failure("400", "자신의 입찰에 재입찰 할 수 없습니다."), HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<>(ResponseVO.failure("400", "현재 입찰가가 더 높습니다."), HttpStatus.BAD_REQUEST);
        }
    }
}

