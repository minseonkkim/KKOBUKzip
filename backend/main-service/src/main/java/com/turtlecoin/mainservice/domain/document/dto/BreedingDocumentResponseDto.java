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
public class BreedingDocumentResponseDto implements DocumentResponseDto {
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
		private String area;
		private int count;
		private String purpose;
		private LocalDate registerDate;
		private String motherUUID;
		private String motherAquisition;
		private String fatherUUID;
		private String fatherAquisition;
		private String locationSpecification;
		private String multiplicationMethod;
		private String shelterSpecification;
	}
}
