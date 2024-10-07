package com.turtlecoin.auctionservice.feign.dto;

import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TurtleResponseDTO {
    private Long id;
    private Gender gender;
    private int weight;
    private LocalDate birth;
    private Long userId;
}
