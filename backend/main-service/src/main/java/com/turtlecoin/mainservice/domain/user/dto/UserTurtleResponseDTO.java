package com.turtlecoin.mainservice.domain.user.dto;

import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTurtleResponseDTO {
    private Long id;
    private String name;
    private String scientificName;
    private String turtleUuid;
    private Gender gender;
    private int weight;
    private LocalDate birth;
    private boolean dead;
    private String imageAddress;
    private String motherName;
    private String motherImageAddress;
    private String fatherName;
    private String fatherImageAddress;
}
