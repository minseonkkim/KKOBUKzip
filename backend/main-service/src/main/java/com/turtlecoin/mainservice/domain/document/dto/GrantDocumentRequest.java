package com.turtlecoin.mainservice.domain.document.dto;

import java.time.LocalDate;

import com.turtlecoin.mainservice.domain.document.entity.DocType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class GrantDocumentRequest {
	private String documentHash;
	private String turtleUUID;
	private String docType;
	private String applicant;
	private Detail detail;

	@Builder
	@Data
	@AllArgsConstructor
	public static class Detail {
		Grantor grantor;
		String turtleUUID;
		String aquisition;
		String motherUUID;
		String fatherUUID;
	}

	@Data
	@AllArgsConstructor
	public static class Grantor {
		String name;
		String phoneNumber;
		String address;
	}
}
