package com.turtlecoin.mainservice.domain.document.entity;

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

	@Column(nullable = true, name = "document_hash")
	private String documentHash;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Progress progress;

	@Column(nullable = false, name = "turtle_uuid")
	private String turtleUUID;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, name = "doc_type")
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
