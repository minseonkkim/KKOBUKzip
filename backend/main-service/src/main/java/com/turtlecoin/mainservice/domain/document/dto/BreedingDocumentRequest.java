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
		Integer count;
		String purpose;
		String location;
		LocalDate registerDate;
		String motherUUID;
		String fatherUUID;
		LocalDate birth;
		String name;
		Integer weight;
		Gender gender;
	}

	public boolean isValid(){
		return (
			docType != null && applicant != null && detail != null && detail.getScientificName() != null
			&& detail.getArea() != null && detail.count != null && detail.purpose != null && detail.location != null
			&& detail.registerDate != null && detail.motherUUID != null && detail.fatherUUID != null
			&& detail.birth != null && detail.name != null && detail.weight != null && detail.gender != null
		);
	}
}

