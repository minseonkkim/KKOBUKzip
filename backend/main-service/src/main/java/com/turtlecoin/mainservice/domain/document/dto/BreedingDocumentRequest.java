package com.turtlecoin.mainservice.domain.document.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.turtlecoin.mainservice.domain.turtle.entity.Gender;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BreedingDocumentRequest {
	private String docType;
	private String applicant;
	private Detail detail;

	@Data
	@AllArgsConstructor
	public static class Detail {
		String scientificName;
		String area;
		int count;
		String purpose;
		String location;
		LocalDate registerDate;
		String motherUUID;
		String fatherUUID;
		LocalDate birth;
		String name;
		int weight;
		Gender gender;
	}
}

