package com.turtlecoin.mainservice.domain.turtle.dto;

import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AuctionTurtleInfoDTO {
    private Long id;
    private Gender gender;
    private String scientificName;
    private int weight;
    private LocalDate birth;
    private Long userId;
}
