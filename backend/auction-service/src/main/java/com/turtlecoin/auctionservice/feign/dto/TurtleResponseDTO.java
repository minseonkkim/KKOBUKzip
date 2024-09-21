package com.turtlecoin.auctionservice.feign.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TurtleResponseDTO {
    private Long id;
    private String gender;
    private Double size;
    private Double price;
}
