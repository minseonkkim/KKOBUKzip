package com.turtlecoin.mainservice.domain.document.entity;

import com.turtlecoin.mainservice.global.entity.BaseEntity;
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

	@Column(name = "document_hash", nullable = false)
	private String documentHash;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Progress progress;

	@Column(name = "turtle_uuid", nullable = true)
	private String turtleUUID;

	@Enumerated(EnumType.STRING)
	@Column(name = "doc_type", nullable = false)
	private DocType docType;

	@Column(nullable = true)
	private String applicant;

	public void assignValuesByBatch(String applicant){
		this.applicant = applicant;
	}

	public boolean approve(){
		if(progress == Progress.DOCUMENT_REVIEWING){
			progress = Progress.DOCUMENT_APPROVED;
			return true;
		}
		return false;
	}

	public boolean reject(){
		if(progress == Progress.DOCUMENT_REVIEWING){
			progress = Progress.DOCUMENT_REJECTED;
			return true;
		}
		return false;
	}
}
