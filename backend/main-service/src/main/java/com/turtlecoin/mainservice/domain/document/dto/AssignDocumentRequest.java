package com.turtlecoin.mainservice.domain.document.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AssignDocumentRequest {
	private String docType;
	private String applicant;
	private Detail detail;

	@Data
	@AllArgsConstructor
	public static class Detail {
		Assignee assignee;
		String turtleUUID;
		int count;
		String purpose;
		String transferReason;
	}

	@Data
	@AllArgsConstructor
	public static class Assignee {
		String name;
		String phoneNumber;
		String address;
	}
}
