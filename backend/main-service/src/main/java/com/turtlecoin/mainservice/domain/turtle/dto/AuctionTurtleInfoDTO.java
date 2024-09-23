package com.turtlecoin.mainservice.domain.turtle.dto;

import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuctionTurtleInfoDTO {
    private Long id;
    private Gender gender;
    private int size;
}
