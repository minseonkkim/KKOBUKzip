package com.turtlecoin.mainservice.domain.user.dto;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long userId;
    private String nickname;
    private String email;
    private String name;
    private String profileImage;
}
