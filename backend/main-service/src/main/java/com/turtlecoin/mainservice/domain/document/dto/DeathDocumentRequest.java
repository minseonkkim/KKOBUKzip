package com.turtlecoin.mainservice.domain.document.dto;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class DeathDocumentRequest {
	private String docType;
	private String applicant;
	private Detail detail;

	@Builder
	@Getter
	public static class Detail {
		String shelter;
		int count;
		String deathReason;
		String plan;
		LocalDate registerDate;
	}
}
