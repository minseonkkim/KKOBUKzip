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
	private Long transactionId;
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

	public boolean isValid(){
		return (
			docType != null && applicant != null && detail != null
			&& detail.assignee != null && detail.turtleUUID != null && detail.purpose != null && detail.transferReason != null
			&& detail.assignee.name != null && detail.assignee.phoneNumber != null && detail.assignee.address != null
		);
	}
}
