package com.turtlecoin.mainservice.domain.document.entity;

import java.util.UUID;

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
	private UUID turtleUUID;

	@Column(nullable = false)
	private DocType docType;
}
