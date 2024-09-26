package com.turtlecoin.mainservice.domain.turtle.dto;

import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TurtleResponseDTO {
    private Long id;
    private Gender gender;
    private int weight;
    private Long userId;
}
