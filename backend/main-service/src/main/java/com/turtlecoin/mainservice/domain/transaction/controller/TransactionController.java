package com.turtlecoin.mainservice.domain.transaction.controller;

import com.turtlecoin.mainservice.domain.transaction.dto.DetailTransactionResponseDto;
import com.turtlecoin.mainservice.domain.transaction.dto.TransactionRequestDto;
import com.turtlecoin.mainservice.domain.transaction.entity.Transaction;
import com.turtlecoin.mainservice.domain.transaction.repository.TransactionRepository;
import com.turtlecoin.mainservice.domain.transaction.service.TransactionService;
import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import com.turtlecoin.mainservice.domain.turtle.repository.TurtleRepository;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.repository.UserRepository;
import com.turtlecoin.mainservice.global.response.ResponseVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/main/transaction")
public class TransactionController {
    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final TurtleRepository turtleRepository;

    public TransactionController(TransactionService transactionService, TransactionRepository transactionRepository, UserRepository userRepository, TurtleRepository turtleRepository) {
        this.transactionService = transactionService;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.turtleRepository = turtleRepository;
    }

    @GetMapping("/test")
    public String test() {
        return "Hi! It's Test!!";
    }

    // 전체 거래 조회
    @GetMapping("/")
    public ResponseEntity<?> entireTransactions(@RequestParam(value="gender", required = false) Gender gender,
                                                @RequestParam(value="size", required = false) String size,
                                                @RequestParam(value="price", required = false) String price,
                                                @RequestParam(value="progress", required = false) Integer progress,
                                                @RequestParam(value="page", defaultValue = "0") int page){
        return transactionService.getEntireTransaction(gender, size, price, progress, page);
    }

    // 상세 거래 조회
    @GetMapping("/{transactionId}")
    public ResponseEntity<?> getTransactionById(@PathVariable("transactionId") Long transactionId) {
        Transaction transaction = transactionRepository.findOneById(transactionId);
        DetailTransactionResponseDto data = transaction.toResponseDTO();
        return new ResponseEntity<>(ResponseVO.success("거래가 정상적으로 조회되었습니다.","turtle",data), HttpStatus.OK);
    }
    // 거래 등록
    @PostMapping(value="/", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> enrollTransaction(
            @RequestPart("data") TransactionRequestDto dto,
            @RequestPart("transactionPhotos") List<MultipartFile> photos){
        return transactionService.enrollTransaction(dto,photos);
    }

    @PatchMapping("/start/{transactionId}")
    public ResponseEntity<?> startTransaction(@PathVariable("transactionId") Long transactionId)  {
        try{
            Transaction transaction = transactionRepository.findById(transactionId)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 거래 ID입니다."));
            transaction.changeStatusToReviewDocument();
            transactionRepository.save(transaction);
            return new ResponseEntity<>(ResponseVO.success("거래 상태가 정상적으로 업데이트되었습니다."), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // 거래 ID가 유효하지 않을 때 처리
            return new ResponseEntity<>(ResponseVO.failure("400","거래 ID가 유효하지 않습니다."), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // 상태 업데이트 실패 시 처리
            return new ResponseEntity<>(ResponseVO.failure("500","거래 상태 업데이트에 실패했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/end/{transactionId}")
    public ResponseEntity<?> endTransaction(@PathVariable("transactionId") Long transactionId)  {
        try{
            Transaction transaction = transactionRepository.findById(transactionId)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 거래 ID입니다."));
            transaction.changeStatusToCompleteDocument();
            transactionRepository.save(transaction);
            return new ResponseEntity<>(ResponseVO.success("거래 상태가 정상적으로 업데이트되었습니다."), HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            // 거래 ID가 유효하지 않을 때 처리
            return new ResponseEntity<>(ResponseVO.failure("400","거래 ID가 유효하지 않습니다."), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // 상태 업데이트 실패 시 처리
            return new ResponseEntity<>(ResponseVO.failure("500","거래 상태 업데이트에 실패했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
