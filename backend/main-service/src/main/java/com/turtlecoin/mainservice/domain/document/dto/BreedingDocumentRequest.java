package com.turtlecoin.mainservice.domain.document.dto;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class BreedingDocumentRequest {
	private String docType;
	private String applicant;
	private Detail detail;

	@Builder
	@Getter
	public static class Detail {
		String scientificName;
		String area;
		int count;
		String purpose;
		String location;
		LocalDate registerDate;
		String motherUUID;
		String fatherUUID;
	}
}

