package com.turtlecoin.mainservice.domain.document.service;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.turtlecoin.mainservice.domain.document.dto.ApplicantResponseDto;
import com.turtlecoin.mainservice.domain.document.dto.BreedingDocumentResponseDto;
import com.turtlecoin.mainservice.domain.document.dto.DeathDocumentResponseDto;
import com.turtlecoin.mainservice.domain.document.dto.DocumentApprovalRequestDto;
import com.turtlecoin.mainservice.domain.document.dto.DocumentListDto;
import com.turtlecoin.mainservice.domain.document.dto.DocumentResponseDto;
import com.turtlecoin.mainservice.domain.document.dto.TransferDocumentResponseDto;
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

	// 이게 맞나...?
	// 서류 조회
	public DocumentResponseDto getDocument(String documentHash, String turtleUUID) {
		DocumentResponseDto documentResponseDto = null;

		Document document = documentRepository.findByDocumentHashAndTurtleUUID(documentHash, turtleUUID);
		switch (document.getDocType()) {
			case BREEDING:
				documentResponseDto = BreedingDocumentResponseDto.builder()
					.docType(docTypeService.convertToString(document.getDocType()))
					.turtleUUID(document.getTurtleUUID())
					.documentHash(document.getDocumentHash())
					.applicant(ApplicantResponseDto.builder()
						.name(null)
						.email(null)
						.foreignFlag(null)
						.phonenumber(null)
						.birth(null)
						.address(null)
						.build())
					.detail(BreedingDocumentResponseDto.Detail.builder()
						.scientificName("Malaclemys terrapin")
						.area(null)
						.count(0)
						.purpose(null)
						.registerDate(null)
						.motherUUID(null)
						.motherAquisition(null)
						.fatherUUID(null)
						.fatherAquisition(null)
						.locationSpecification(null)
						.multiplicationMethod(null)
						.shelterSpecification(null)
						.build())
					.build();
				break;
			case TRANSFER:
				documentResponseDto = TransferDocumentResponseDto.builder()
					.docType(docTypeService.convertToString(document.getDocType()))
					.turtleUUID(document.getTurtleUUID())
					.documentHash(document.getDocumentHash())
					.applicant(ApplicantResponseDto.builder()
						.name(null)
						.email(null)
						.foreignFlag(null)
						.phonenumber(null)
						.birth(null)
						.address(null)
						.build())
					.assignee(TransferDocumentResponseDto.UserResponseDto.builder()
						.name(null)
						.phoneNumber(null)
						.address(null)
						.build())
					.grantor(TransferDocumentResponseDto.UserResponseDto.builder()
						.name(null)
						.phoneNumber(null)
						.address(null)
						.build())
					.detail(TransferDocumentResponseDto.Detail.builder()
						.scientificName("Malaclemys terrapin")
						.count(0)
						.registerDate(null)
						.transferReason(null)
						.motherUUID(null)
						.motherAquisition(null)
						.fatherUUID(null)
						.fatherAquisition(null)
						.build())
					.build();
				break;
			default:
				documentResponseDto = DeathDocumentResponseDto.builder()
					.docType(docTypeService.convertToString(document.getDocType()))
					.turtleUUID(document.getTurtleUUID())
					.documentHash(document.getDocumentHash())
					.applicant(ApplicantResponseDto.builder()
						.name(null)
						.email(null)
						.foreignFlag(null)
						.phonenumber(null)
						.birth(null)
						.address(null)
						.build())
					.detail(DeathDocumentResponseDto.Detail.builder()
						.scientificName("Malaclemys terrapin")
						.shelter(null)
						.count(0)
						.registerDate(null)
						.deathReason(null)
						.plan(null)
						.deathImage(null)
						.diagnosis(null)
						.build())
					.build();
				break;
		}

		return documentResponseDto;
	}

	// 서류 승인 또는 반려
	@Transactional
	public void approveDocument(DocumentApprovalRequestDto documentApprovalRequestDto) {
		Document document = documentRepository.findByDocumentHashAndTurtleUUID(documentApprovalRequestDto.getDocumentHash(), documentApprovalRequestDto.getTurtleUUID());
		if(documentApprovalRequestDto.isFlag()){
			document.approve();
		}
		else document.reject();
	}
}
