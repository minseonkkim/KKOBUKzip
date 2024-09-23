package com.turtlecoin.mainservice.domain.document.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DeathDocumentRequest {
	private String docType;
	private String applicant;
	private Detail detail;

	@Data
	@AllArgsConstructor
	public static class Detail {
		String turtleUUID;
		String shelter;
		int count;
		String deathReason;
		String plan;
		LocalDate registerDate;
	}
}
