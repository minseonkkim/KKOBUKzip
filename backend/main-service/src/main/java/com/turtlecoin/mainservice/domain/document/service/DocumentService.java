package com.turtlecoin.mainservice.domain.document.service;

import java.util.List;
import java.util.Optional;

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
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@Repository
@RequiredArgsConstructor
public class DocumentService {
	private final DocumentRepository documentRepository;
	private final DocTypeService docTypeService;
	private final UserService userService;
	private final ContractService contractService;

	// 서류 저장
	@Transactional
	public void save(Document document) {
		documentRepository.save(document);
	}

	// 서류 리스트를 조회하는 함수
	public List<DocumentListDto> getDocumentList(){
		List<Document> documents = documentRepository.findAllByProgress(Progress.DOCUMENT_REVIEWING);

		List<DocumentListDto> documentListDtos = documents.stream()
			.map(document -> {
				// 신청자 정보 가져오기
				User user = userService.getUserByUUID(document.getApplicant());

				return DocumentListDto.builder()
					.docType(docTypeService.convertToString(document.getDocType()))
					.scientificName("Malaclemys terrapin")
					.name(user.getName())
					.email(user.getEmail())
					.registerDate(document.getCreateDate().toLocalDate())
					.turtleUUID(document.getTurtleUUID())
					.documentHash(document.getDocumentHash())
					.build();
			})
			.toList();

		return documentListDtos;
	}

	// 이게 맞나...?
	// 서류 조회
	public DocumentResponseDto responseDocument(String documentHash, String turtleUUID) throws Exception{
		DocumentResponseDto documentResponseDto = null;
		Optional<Document> documentOption = documentRepository.findByDocumentHashAndTurtleUUID(documentHash, turtleUUID);
		if(!documentOption.isPresent()) {
			throw new Exception("거북이를 찾을 수 없습니다.");
		}
		Document document = documentOption.get();
		User user = userService.getUserByUUID(document.getApplicant());

		// 블록체인에서 서류 상세 정보 가져오기

		switch(document.getDocType()) {
			case BREEDING :
				// 블록체인에서 가져오기
				contract.TurtleDocumentation.Multiplication breedingDetail = contractService.searchTurtleMultiplicationDocument(turtleUUID, documentHash);

				documentResponseDto = BreedingDocumentResponseDto.builder()
					.docType(docTypeService.convertToString(document.getDocType()))
					.turtleUUID(document.getTurtleUUID())
					.documentHash(document.getDocumentHash())
					.applicant(ApplicantResponseDto.builder()
						.name(user.getName())
						.email(user.getEmail())
						.korean(user.getForeignFlag())
						.phonenumber(user.getPhonenumber())
						.birth(user.getBirth())
						.address(user.getAddress())
						.build())
					.detail(BreedingDocumentResponseDto.Detail.builder()
						.scientificName("Malaclemys terrapin")
						.area(breedingDetail.area)
						.count(breedingDetail.count.intValue())
						.purpose(breedingDetail.purpose)
						.registerDate(document.getCreateDate().toLocalDate())
						.motherUUID(breedingDetail.motherId)
						.motherAquisition(contractService.searchCurrentDocumentHash(breedingDetail.motherId))
						.fatherUUID(breedingDetail.fatherId)
						.fatherAquisition(contractService.searchCurrentDocumentHash(breedingDetail.fatherId))
						.locationSpecification(breedingDetail.locationSpecification)
						.multiplicationMethod(breedingDetail.multiplicationMethod)
						.shelterSpecification(breedingDetail.shelterSpecification)
						.build())
					.build();
				break;
			case DEATH :
				// 블록체인에서 가져오기
				contract.TurtleDocumentation.Death deathDetail = contractService.searchTurtleDeathDocument(turtleUUID, documentHash);

				documentResponseDto = DeathDocumentResponseDto.builder()
					.docType(docTypeService.convertToString(document.getDocType()))
					.turtleUUID(document.getTurtleUUID())
					.documentHash(document.getDocumentHash())
					.applicant(ApplicantResponseDto.builder()
						.name(user.getName())
						.email(user.getEmail())
						.korean(user.getForeignFlag())
						.phonenumber(user.getPhonenumber())
						.birth(user.getBirth())
						.address(user.getAddress())
						.build())
					.detail(DeathDocumentResponseDto.Detail.builder()
						.scientificName("Malaclemys terrapin")
						.shelter(deathDetail.shelter)
						.count(deathDetail.count.intValue())
						.registerDate(document.getCreateDate().toLocalDate())
						.deathReason(deathDetail.deathReason)
						.plan(deathDetail.plan)
						.deathImage(deathDetail.deathImage)
						.diagnosis(deathDetail.diagnosis)
						.build())
					.build();
				break;
			case TRANSFER:
				// 블록체인에서 가져오기
				contract.TurtleDocumentation.Transfer transferDetail = contractService.searchTurtleTransferDocument(turtleUUID, documentHash);
				// 사용자 조회
				User assignee = userService.getUserByUUID(transferDetail.assigneeId);
				User grantor = userService.getUserByUUID(transferDetail.grantorId);

				documentResponseDto = TransferDocumentResponseDto.builder()
					.docType(docTypeService.convertToString(document.getDocType()))
					.turtleUUID(document.getTurtleUUID())
					.documentHash(document.getDocumentHash())
					.applicant(ApplicantResponseDto.builder()
						.name(user.getName())
						.email(user.getEmail())
						.korean(user.getForeignFlag())
						.phonenumber(user.getPhonenumber())
						.birth(user.getBirth())
						.address(user.getAddress())
						.build())
					.assignee(TransferDocumentResponseDto.UserResponseDto.builder()
						.name(assignee.getName())
						.phoneNumber(assignee.getPhonenumber())
						.address(assignee.getAddress())
						.build())
					.grantor(TransferDocumentResponseDto.UserResponseDto.builder()
						.name(grantor.getName())
						.phoneNumber(grantor.getPhonenumber())
						.address(grantor.getAddress())
						.build())
					.detail(TransferDocumentResponseDto.Detail.builder()
						.scientificName("Malaclemys terrapin")
						.count(transferDetail.count.intValue())
						.registerDate(document.getCreateDate().toLocalDate())
						.transferReason(transferDetail.transferReason)
						.motherUUID(transferDetail.motherId)
						.motherAquisition(contractService.searchCurrentDocumentHash(transferDetail.motherId))
						.fatherUUID(transferDetail.fatherId)
						.fatherAquisition(contractService.searchCurrentDocumentHash(transferDetail.motherId))
						.build())
					.build();
				break;
		}

		return documentResponseDto;
	}

	// 서류 승인 또는 반려
	@Transactional
	public void approveDocument(DocumentApprovalRequestDto documentApprovalRequestDto) {
		Document document = documentRepository.findByDocumentHashAndTurtleUUID(documentApprovalRequestDto.getDocumentHash(), documentApprovalRequestDto.getTurtleUUID()).get();
		if(documentApprovalRequestDto.isFlag()){
			document.approve();
		}
		else document.reject();
	}
}
