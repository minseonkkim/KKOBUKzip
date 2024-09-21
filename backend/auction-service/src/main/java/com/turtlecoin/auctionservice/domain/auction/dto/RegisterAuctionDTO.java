package com.turtlecoin.auctionservice.domain.auction.dto;

import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionPhoto;
import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

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
    private Double weight;   // 거북이 무게 추가
    private Gender gender;   // 거북이 성별 추가

    public Auction toEntity(List<AuctionPhoto> auctionPhotos) {
        return Auction.builder()
                .id(id)
                .turtleId(turtleId)
                .userId(userId)
                .startTime(startTime)
                .minBid(minBid)
                .content(content)
                .title(title)
                .auctionProgress(AuctionProgress.BEFORE_AUCTION)
                .auctionPhotos(auctionPhotos)  // 사진 리스트 추가
                .build();
    }
}
