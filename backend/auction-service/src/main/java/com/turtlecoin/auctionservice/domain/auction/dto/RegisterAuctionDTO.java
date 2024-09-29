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

@Slf4j
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RegisterAuctionDTO {
    private Long id;
    private Long turtleId;
    private Long userId;
    private LocalDateTime startTime;
    private Double minBid;
    private String content;
    private String title;
    private int weight;   // 거북이 무게 추가
    private Gender gender;   // 거북이 성별 추가
    private List<AuctionTag> auctionTags;

    public Auction toEntity() {
        return Auction.builder()
                .id(id)
                .turtleId(turtleId)
                .userId(userId)
                .startTime(startTime)
                .minBid(minBid)
                .content(content)
                .title(title)
                .nowBid(minBid)
                .auctionTags(auctionTags != null ? auctionTags : new ArrayList<>())  // tags가 null일 경우 빈 리스트로 초기화
                .auctionProgress(AuctionProgress.BEFORE_AUCTION)
                .endTime(startTime.plusSeconds(30))
                .build();
    }
}
