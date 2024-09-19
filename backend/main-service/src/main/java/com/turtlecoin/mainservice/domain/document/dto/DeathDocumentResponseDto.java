package com.turtlecoin.mainservice.domain.document.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeathDocumentResponseDto implements DocumentResponseDto {
	private String docType;
	private String turtleUUID;
	private String documentHash;
	private ApplicantResponseDto applicant;
	private Detail detail;

	@Builder
	@Data
	@AllArgsConstructor
	public static class Detail {
		private String scientificName;
		private String shelter;
		private int count;
		private LocalDate registerDate;
		private String deathReason;
		private String plan;
		private String deathImage;
		private String diagnosis;
	}
}
