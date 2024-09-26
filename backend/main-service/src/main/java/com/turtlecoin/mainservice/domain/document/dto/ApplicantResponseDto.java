package com.turtlecoin.mainservice.domain.document.dto;

import java.time.LocalDate;

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
	private boolean korean;
	private String phonenumber;
	private String email;
	private LocalDate birth;
	private String address;
}
