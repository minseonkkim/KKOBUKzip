package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionPhoto;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionTag;
import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
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

    @Transactional
    public Auction toEntity() {
        Auction auction = Auction.builder()
                .turtleId(turtleId)
                .userId(userId)
                .startTime(startTime)
                .minBid(minBid)
                .content(content)
                .title(title)
                .nowBid(minBid)
                .weight(weight)
                .sellerAddress(sellerAddress)
                .auctionProgress(AuctionProgress.BEFORE_AUCTION)
                .endTime(startTime.plusSeconds(30))
                .build();

        // 태그가 있는 경우 AuctionTag 생성 및 Auction과 연관 설정
        if (auctionTags != null) {
            log.info("AuctionTags: {}", auctionTags);
            List<AuctionTag> tagEntities = auctionTags.stream()
                    .map(tag -> new AuctionTag(auction, tag))  // Auction 객체와 태그 문자열을 함께 전달
                    .collect(Collectors.toList());
            auction.getAuctionTags().addAll(tagEntities);  // 생성된 태그 리스트를 Auction에 추가
        }

        return auction;
    }
}
