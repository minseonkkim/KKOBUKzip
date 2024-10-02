package com.turtlecoin.mainservice.domain.transaction.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class DetailTransactionResponseDto {
    private Long transactionId;
    private Long sellerId;
    private String sellerName;
    private Long turtleId;
    private String scientificName;
    private Double price;
    private String createDate;
    private String title;
    private String sellerImageUrl;
    private int weight;
    private String content;
    private List<String> transactionTag;  // 태그 목록
    private List<String> transactionImage;  // 이미지 경로 목록
    private String progress;  // 진행 상황 (Enum 값)
}
