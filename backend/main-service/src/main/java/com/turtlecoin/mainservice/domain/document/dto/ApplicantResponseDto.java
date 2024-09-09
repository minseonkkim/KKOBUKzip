package com.turtlecoin.mainservice.domain.document.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ApplicantResponseDto {
	private String name;
	private String foreignFlag;
	private String phonenumber;
	private String email;
	private String birth;
	private String address;
}
