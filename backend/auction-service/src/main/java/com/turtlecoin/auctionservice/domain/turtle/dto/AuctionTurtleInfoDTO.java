package com.turtlecoin.auctionservice.domain.turtle.dto;

import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuctionTurtleInfoDTO {
    private Long id;
    private Gender gender;
    private Double size;
}

