package com.turtlecoin.mainservice.domain.document.dto;

import java.time.LocalDate;

import com.turtlecoin.mainservice.domain.document.entity.DocType;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class GrantDocumentRequest {
	private String docType;
	private String applicant;
	private Detail detail;

	@Builder
	@Getter
	public static class Detail {
		Grantor grantor;
		String turtleUUID;
		String aquisition;
		String motherUUID;
		String fatherUUID;
	}

	@Builder
	@Getter
	public static class Grantor {
		String name;
		String phoneNumber;
		String address;
	}
}
