package com.turtlecoin.mainservice.domain.document.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.turtlecoin.mainservice.domain.document.dto.DocumentApprovalDto;
import com.turtlecoin.mainservice.domain.document.dto.DocumentListDto;
import com.turtlecoin.mainservice.domain.document.dto.TempDto;
import com.turtlecoin.mainservice.domain.document.entity.DocType;
import com.turtlecoin.mainservice.domain.document.entity.Document;
import com.turtlecoin.mainservice.domain.document.entity.Progress;
import com.turtlecoin.mainservice.domain.document.repository.DocumentRepository;

import lombok.RequiredArgsConstructor;

@Service
@Repository
@RequiredArgsConstructor
public class DocumentService {
	private final DocumentRepository documentRepository;
	private final DocTypeService docTypeService;

	// 서류 저장
	@Transactional
	public void save(Document document) {
		documentRepository.save(document);
	}

	/*
				유저 서비스 구현되면 꼭 추가 해줘야 함!!!!!!!!!!!!!!!!!!!!!!1
	 */
	public List<DocumentListDto> getDocumentList(){
		List<Document> documents = documentRepository.findAllByProgress(Progress.DOCUMENT_REVIEWING);

		List<DocumentListDto> documentListDtos = documents.stream()
			.map(document -> {
				return DocumentListDto.builder()
					.docType(docTypeService.convertToString(document.getDocType()))
					.scientificName("Malaclemys terrapin")
					.name(null)
					.email(null)
					.registerDate(null)
					.turtleUUID(document.getTurtleUUID())
					.documentHash(document.getDocumentHash())
					.build();
			})
			.toList();

		return documentListDtos;
	}

	// 서류 승인 또는 반려
	public void approveDocument(DocumentApprovalDto documentApprovalDto) {
		Document document = documentRepository.findByDocumentHashAndTurtleUUID(documentApprovalDto.getDocumentHash(), documentApprovalDto.getTurtleUUID());
		if(documentApprovalDto.isFlag()){

		}
	}

	public TempDto getDocument(String documentHash, String turtleUUID){
		Document document = documentRepository.findByDocumentHashAndTurtleUUID(documentHash, turtleUUID);
		return document.toTempDto();
	}
}
