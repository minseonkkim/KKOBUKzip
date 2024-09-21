package com.turtlecoin.auctionservice.feign.dto;

import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long id;
    private String nickname;
    private String email;
    private String name;
}
