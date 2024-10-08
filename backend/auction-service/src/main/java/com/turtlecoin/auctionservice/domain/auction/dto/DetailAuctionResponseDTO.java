package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetailAuctionResponseDTO {
    private Long auctionId;
    private Long sellerId;
    private String sellerName;
    private String documentHash;
    private Long turtleId;
    private String scientificName;
    private Double price;
    private String createDate;
    private String title;
    private String sellerImageUrl;
    private String sellerUuid;
    private String sellerAddress;
    private String turtleUuid;
    private Long buyerId;
    private String buyerUuid;
    private int weight;
    private String content;
    private List<String> auctionTag;  // 태그 목록
    private List<String> auctionImage;  // 이미지 경로 목록
    private String progress;  // 진행 상황 (Enum 값)
}
