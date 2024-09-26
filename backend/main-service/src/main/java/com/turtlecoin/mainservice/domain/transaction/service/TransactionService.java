package com.turtlecoin.mainservice.domain.transaction.service;

import com.turtlecoin.mainservice.domain.s3.service.ImageUploadService;
import com.turtlecoin.mainservice.domain.transaction.dto.DetailTransactionResponseDto;
import com.turtlecoin.mainservice.domain.transaction.dto.TransactionDto;
import com.turtlecoin.mainservice.domain.transaction.dto.TransactionRequestDto;
import com.turtlecoin.mainservice.domain.transaction.entity.Transaction;
import com.turtlecoin.mainservice.domain.transaction.entity.TransactionPhoto;
import com.turtlecoin.mainservice.domain.transaction.entity.TransactionProgress;
import com.turtlecoin.mainservice.domain.transaction.entity.TransactionTag;
import com.turtlecoin.mainservice.domain.transaction.repository.TransactionRepository;
import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import com.turtlecoin.mainservice.domain.turtle.repository.TurtleRepository;
import com.turtlecoin.mainservice.global.response.ResponseVO;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    private final ImageUploadService imageUploadService;
    private final TurtleRepository turtleRepository;
    private final TransactionRepository transactionRepository;

    public TransactionService(ImageUploadService imageUploadService, TurtleRepository turtleRepository, TransactionRepository transactionRepository) {
        this.imageUploadService = imageUploadService;
        this.turtleRepository = turtleRepository;
        this.transactionRepository = transactionRepository;
    }

    // 거래 등록하는 서비스
    @Transactional
    public ResponseEntity<?> enrollTransaction(TransactionRequestDto dto, List<MultipartFile> photos) {
        TransactionDto transaction = new TransactionDto();
        Turtle turtle = turtleRepository.getReferenceById(dto.getTurtle_id());

        transaction.setTitle(dto.getTitle());
        transaction.setContent(dto.getContent());
        transaction.setPrice(dto.getPrice());
        transaction.setWeight(dto.getWeight());
        transaction.setTurtle(turtle);
        transaction.setTransactionPhotos(new ArrayList<>());
        transaction.setTransactionTags(new ArrayList<>());
        Transaction savedTransaction = transaction.toEntity();
        try{
            if (!dto.getTransactionTags().isEmpty()) {
                List<String> imageUrls = imageUploadService.uploadMultiple(photos, "transaction");
                savedTransaction.getTransactionPhotos().addAll(stringToDto(imageUrls, savedTransaction));
                savedTransaction.getTags().addAll(stringToTransactionTag(dto.getTransactionTags(), savedTransaction));
            }

            // 저장된 거래 정보를 데이터베이스에 저장
            transactionRepository.save(savedTransaction);
        }catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(ResponseVO.failure("400", "거래 등록 과정 중에 이미지 업로드 오류가 발생하였습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (DataAccessException e) {
            e.printStackTrace();
            return new ResponseEntity<>(ResponseVO.failure("500", "거래 등록 과정 중에 데이터베이스 오류가 발생하였습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(ResponseVO.failure("500", "거래 등록 과정 중에 예기치 않은 오류가 발생하였습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(ResponseVO.success("거래글이 성공적으로 작성되었습니다."), HttpStatus.OK);
    }

    // 전체 거래 조회
    public ResponseEntity<?> getEntireTransaction(Gender gender, String size, String price, int progress, int page) {
        try{
            Pageable pageable = PageRequest.of(page, 20);
            String[] sizeRange = size.split("-");
            String[] priceRange = price.split("-");
            Page<Transaction> transactionPage =transactionRepository.findFilteredTransactions(
                    gender,
                    Double.parseDouble(sizeRange[0]),
                    Double.parseDouble(sizeRange[1]),
                    Double.parseDouble(priceRange[0]),
                    Double.parseDouble(priceRange[1]),
                    getProgressList(progress),
                    pageable
            );
            Map<String,Object> data = new HashMap<>();
            List<DetailTransactionResponseDto> transactionDtos = transactionPage.getContent().stream()
                    .map(Transaction::toResponseDTO)  // Transaction에서 DTO로 변환하는 메서드 호출
                    .collect(Collectors.toList());

            data.put("cnt", transactionPage.getTotalPages());
            data.put("current_page", page);
            data.put("transactions", transactionDtos);
            return new ResponseEntity<>(ResponseVO.success("거래 목록 조회 성공","data",data),HttpStatus.OK);

        }catch (NumberFormatException e) {
            // 숫자 형식이 잘못된 경우 예외 처리
            return new ResponseEntity<>(ResponseVO.failure("400", "잘못된 형식의 입력값이 있습니다."), HttpStatus.BAD_REQUEST);

        } catch (IllegalArgumentException e) {
            // 기타 잘못된 인자 처리
            return new ResponseEntity<>(ResponseVO.failure("400", "잘못된 파라미터입니다."), HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            // 기타 예외 처리 (서버 오류)
            e.printStackTrace();  // 로그 출력
            return new ResponseEntity<>(ResponseVO.failure("500", "서버 에러가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // string을 TransactionPhoto로 변환하는 로직
    public List<TransactionPhoto> stringToDto(List<String> imageUrls, Transaction transaction) {
        List<TransactionPhoto> transactionPhotos = new ArrayList<>();

        for (String imageUrl : imageUrls) {
            TransactionPhoto transactionPhoto = new TransactionPhoto(imageUrl, transaction);
            transactionPhotos.add(transactionPhoto);
        }

        return transactionPhotos;
    }

    // string을 TransactionTag로 변환하는 로직
    public List<TransactionTag> stringToTransactionTag(List<String> tagStrings, Transaction transaction) {
        List<TransactionTag> transactionTagList = new ArrayList<>();

        for (String tagString : tagStrings) {
            TransactionTag transactionTag = new TransactionTag(tagString,transaction);
            transactionTagList.add(transactionTag); // 리스트에 추가
        }

        return transactionTagList;
    }

    //거래내역 조회에서 enum 적용을 위한 로직
    public List<TransactionProgress> getProgressList(int progress) {
        List<TransactionProgress> progressList = new ArrayList<>();
        switch (progress) {
            case 1:
                progressList.add(TransactionProgress.SAIL);
                break;
            case 2:
                progressList.add(TransactionProgress.REVIEW_DOCUMENT);
                progressList.add(TransactionProgress.APPROVED_DOCUMENT);
                break;
            case 3:
                progressList.add(TransactionProgress.COMPLETED);
                break;
        }
        return progressList;
    }
}
