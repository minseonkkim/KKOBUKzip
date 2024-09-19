package com.turtlecoin.mainservice.domain.user.dto;

import lombok.Data;

@Data
public class EmailDto {
    private String email;
    private String verification;
}
