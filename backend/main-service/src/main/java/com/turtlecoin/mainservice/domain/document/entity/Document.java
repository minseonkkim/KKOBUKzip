package com.turtlecoin.mainservice.domain.document.entity;

import java.util.UUID;

import com.turtlecoin.mainservice.domain.document.dto.TempDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Document {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String documentHash;

	@Column(nullable = false)
	private Progress progress;

	@Column(nullable = false)
	private String turtleUUID;

	@Column(nullable = false)
	private DocType docType;

	public TempDto toTempDto(){
		TempDto tempDto = new TempDto(documentHash, turtleUUID, docType);
		return tempDto;
	}
}
