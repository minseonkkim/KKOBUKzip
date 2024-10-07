package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionListResponseDto {
    private Long id;
    private Long transactionId;
    private Long sellerId;
    private String sellerName;
    private String sellerAddress;
    private String DocumentHash;
    private Long turtleId;
    private String scientificName;
    private Double price;
    private LocalDate creationDate;
    private String title;
    private String sellerImageUrl;
    private String sellerUuid;
    private String turtleUuid;
    private Long buyerId;
    private String buyerUuid;
    private int weight;
    private String content;
    private AuctionProgress progress;
    private boolean auctionFlag;
    private List<String> tags;  // 태그 목록
    private String images;  // 이미지 경로 목록
}
