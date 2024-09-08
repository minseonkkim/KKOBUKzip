package com.turtlecoin.mainservice.domain.document.entity;

import java.util.UUID;

import com.turtlecoin.mainservice.domain.document.dto.TempDto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class Document {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String documentHash;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Progress progress;

	@Column(nullable = false)
	private String turtleUUID;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private DocType docType;

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
