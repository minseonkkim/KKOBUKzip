package com.turtlecoin.mainservice.domain.document.dto;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Builder
@Data
public class TransferDocumentResponseDto implements DocumentResponseDto {
	private String docType;
	private String turtleUUID;
	private String documentHash;
	private ApplicantResponseDto applicant;
	private UserResponseDto assignee;
	private UserResponseDto grantor;
	private Detail detail;

	@Builder
	@Getter
	public static class UserResponseDto {
		String name;
		String phoneNumber;
		String address;
	}

	@Builder
	@Getter
	public static class Detail {
		private String scientificName;
		private int count;
		private LocalDate registerDate;
		private String transferReason;
		private String aquisition;
		private String motherUUID;
		private String motherAquisition;
		private String fatherUUID;
		private String fatherAquisition;
	}
}
