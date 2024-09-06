package com.turtlecoin.mainservice.domain.document.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class AssignDocumentRequest {
	private String docType;
	private String applicant;
	private Detail detail;

	@Builder
	@Getter
	public static class Detail {
		Assignee assignee;
		String turtleUUID;
		int count;
		String purpose;
		String transferReason;
	}

	@Builder
	@Getter
	public static class Assignee {
		String name;
		String phoneNumber;
		String address;
	}
}
