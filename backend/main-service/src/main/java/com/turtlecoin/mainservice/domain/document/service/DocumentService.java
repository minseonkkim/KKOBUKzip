package com.turtlecoin.mainservice.domain.document.service;

import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.turtlecoin.mainservice.domain.document.dto.TempDto;
import com.turtlecoin.mainservice.domain.document.entity.DocType;
import com.turtlecoin.mainservice.domain.document.entity.Document;
import com.turtlecoin.mainservice.domain.document.repository.DocumentRepository;

import lombok.RequiredArgsConstructor;

@Service
@Repository
@RequiredArgsConstructor
public class DocumentService {
	private final DocumentRepository documentRepository;

	@Transactional
	public void save(Document document) {
		documentRepository.save(document);
	}

	public TempDto getDocument(String documentHash, String turtleUUID){
		Document document = documentRepository.findByDocumentHashAndTurtleUUID(documentHash, turtleUUID);
		return document.toTempDto();
	}
}
