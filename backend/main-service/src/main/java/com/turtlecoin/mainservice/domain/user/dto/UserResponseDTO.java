package com.turtlecoin.mainservice.domain.user.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long userId;
    private String uuid;
    private String nickname;
    private String email;
    private String name;
    private String address;
    private LocalDate birth;
    private String profileImage;
}
