package com.turtlecoin.mainservice.domain.turtle.dto;

import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TurtleResponseDTO {
    private Long turtleId;
    private Gender gender;
    private Double size;
    private Double price;
}
