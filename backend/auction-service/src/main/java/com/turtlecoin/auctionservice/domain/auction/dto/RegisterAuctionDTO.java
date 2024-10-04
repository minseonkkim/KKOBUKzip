package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionPhoto;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionTag;
import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// DTO 수정해야함.
public class RegisterAuctionDTO {
    private Long turtleId;
    private Long userId;
    private LocalDateTime startTime;
    private Double minBid;
    private String content;
    private String title;
    private int weight;   // 거북이 무게 추가
    private String sellerAddress;
    private Gender gender;   // 거북이 성별 추가
    private List<String> auctionTags;

    public Auction toEntity() {
        return Auction.builder()
                .turtleId(turtleId)
                .userId(userId)
                .startTime(startTime)
                .minBid(minBid)
                .content(content)
                .title(title)
                .nowBid(minBid)
                .weight(weight)
                .sellerAddress(sellerAddress)
                .auctionTags(auctionTags != null ? auctionTags.stream()
                        .map(tag -> new AuctionTag(tag))  // String을 AuctionTag로 변환
                        .collect(Collectors.toList()) : new ArrayList<>())  // tags가 null일 경우 빈 리스트로 초기화
                .auctionProgress(AuctionProgress.BEFORE_AUCTION)
                .endTime(startTime.plusSeconds(30))
                .build();
    }
}
