package com.turtlecoin.mainservice.domain.turtle.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TurtleResponseDTO {
    public Long turtleId;
    private String gender;
    private Double size;
    private Double price;
}
