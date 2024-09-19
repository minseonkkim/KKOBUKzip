package com.turtlecoin.mainservice.domain.document.entity;

import com.turtlecoin.mainservice.domain.global.entity.BaseEntity;

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
public class Document extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
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

	public void assignHash(String hash){
		if(documentHash == null && hash != null){
			documentHash = hash;
		}
	}

	public void approve(){
		if(progress == Progress.DOCUMENT_REVIEWING){
			progress = Progress.DOCUMENT_APPROVED;
		}
	}

	public void reject(){
		if(progress == Progress.DOCUMENT_REVIEWING){
			progress = Progress.DOCUMENT_REJECTED;
		}
	}
}
