package com.turtlecoin.auctionservice.feign.dto;

import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import lombok.*;

import java.time.LocalDate;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TurtleFilteredResponseDTO {
    private Long id;
    private Gender gender;
    private String scientificName;
    private int weight;
    private LocalDate birth;
    private Long userId;
}
