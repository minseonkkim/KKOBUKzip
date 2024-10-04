package com.turtlecoin.mainservice.domain.user.dto;

import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import lombok.*;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class FeignTurtleResponseDTO {
    private Long id;
    private Gender gender;
    private int weight;
    private LocalDate birth;
    private Long userId;
}
