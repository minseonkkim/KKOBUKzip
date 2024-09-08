package com.turtlecoin.mainservice.domain.document.entity;

import java.util.UUID;

import com.turtlecoin.mainservice.domain.document.dto.DocumentListDto;
import com.turtlecoin.mainservice.domain.document.dto.TempDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = true)
	private String documentHash;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Progress progress;

	@Column(nullable = false)
	private String turtleUUID;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private DocType docType;

	@Column(nullable = false)
	private String applicant;

	public TempDto toTempDto(){
		TempDto tempDto = new TempDto(documentHash, turtleUUID, docType);
		return tempDto;
	}

	public void assignHash(String hash){
		if(documentHash == null && hash != null){
			documentHash = hash;
		}
	}
}
