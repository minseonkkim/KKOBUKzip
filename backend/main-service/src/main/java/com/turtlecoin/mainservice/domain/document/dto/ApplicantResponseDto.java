package com.turtlecoin.mainservice.domain.document.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ApplicantResponseDto {
	private String name;
	private String foreignFlag;
	private String phonenumber;
	private String email;
	private String birth;
	private String address;
}
