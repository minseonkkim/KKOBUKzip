package com.turtlecoin.mainservice.domain.document.service;

import java.time.LocalDate;
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
import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import com.turtlecoin.mainservice.domain.turtle.repository.TurtleRepository;
import com.turtlecoin.mainservice.domain.turtle.service.TurtleService;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.repository.UserRepository;
import com.turtlecoin.mainservice.domain.user.service.UserService;
import com.turtlecoin.mainservice.global.exception.DocumentNotFoundException;
import com.turtlecoin.mainservice.global.exception.DocumentProgressException;
import com.turtlecoin.mainservice.global.exception.TurtleNotFoundException;
import com.turtlecoin.mainservice.global.exception.UserNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@Repository
@RequiredArgsConstructor
public class DocumentService {
	private final DocumentRepository documentRepository;
	private final DocTypeService docTypeService;
	private final UserService userService;
	private final ContractService contractService;
	private final TurtleRepository turtleRepository;
	private final UserRepository userRepository;
	private final TurtleService turtleService;

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
		if(documentOption.isEmpty()) {
			return null;
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
						// .birth(document.getBirth().toLocalDate())
						// .name(document.getName())
						// .weight(document.getWeight())
						// .gender(document.getGender())
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

				boolean notGranted = grantor == null;

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
						.name( notGranted ? null : grantor.getName())
						.phoneNumber(notGranted ? null : grantor.getPhonenumber())
						.address(notGranted ? null : grantor.getAddress())
						.build())
					.detail(TransferDocumentResponseDto.Detail.builder()
						.scientificName("Malaclemys terrapin")
						.count(transferDetail.count.intValue())
						.registerDate(document.getCreateDate().toLocalDate())
						.transferReason(transferDetail.transferReason)
						.aquisition(contractService.searchCurrentDocumentHash(turtleUUID))
						.motherUUID(transferDetail.motherId)
						.motherAquisition(contractService.searchCurrentDocumentHash(transferDetail.motherId))
						.fatherUUID(transferDetail.fatherId)
						.fatherAquisition(contractService.searchCurrentDocumentHash(transferDetail.fatherId))
						.build())
					.build();
				break;
		}

		return documentResponseDto;
	}

	// 서류 승인 또는 반려
	@Transactional
	public void approveDocument(DocumentApprovalRequestDto documentApprovalRequestDto) throws Exception {
		Optional<Document> documentOptional = documentRepository.findByDocumentHashAndTurtleUUID(documentApprovalRequestDto.getDocumentHash(), documentApprovalRequestDto.getTurtleUUID());
		if(documentOptional.isEmpty()){
			throw new DocumentNotFoundException("입력한 정보와 일치하는 양수 신청서가 존재하지 않습니다.");
		}

		Document document = documentOptional.get();
		if(documentApprovalRequestDto.isApproval()){
			if(!document.approve()){
				throw new DocumentProgressException("이미 검토 완료된 서류입니다.");
			}
			
			// 만약 인공증식 서류 일 경우 DB에 거북이 추가해야 함
			if(document.getDocType() == DocType.BREEDING){
				BreedingDocumentResponseDto documentResponseDto = (BreedingDocumentResponseDto)responseDocument(document.getDocumentHash(), document.getTurtleUUID());
				if(documentResponseDto == null){
					throw new DocumentNotFoundException("입력한 정보와 일치하는 서류가 존재하지 않습니다.");
				}

				Optional<Turtle> fatherOptional = turtleRepository.findByUUID(documentResponseDto.getDetail().getFatherUUID());
				Optional<Turtle> motherOptional = turtleRepository.findByUUID(documentResponseDto.getDetail().getFatherUUID());

				if(fatherOptional.isEmpty() || motherOptional.isEmpty()){
					throw new TurtleNotFoundException("존재하지 않는 부모 개체입니다.");
				}

				Optional<User> userOptional = userRepository.findUserByUUID(document.getApplicant());
				if(userOptional.isEmpty()){
					throw new UserNotFoundException("신청자 정보와 일치하는 회원이 존재하지 않습니다.");
				}

				Turtle turtle = Turtle.builder()
					//.birth(documentResponseDto.getDetail().getBirth())
					.birth(LocalDate.now())
					//.weight(documentResponseDto.getDetail().getWeight())
					.weight(240)
					.dad(fatherOptional.get())
					.mom(motherOptional.get())
					.user(userOptional.get())
					//.name(documentResponseDto.getDetail().getName())
					.name("꼬부기")
					.scientificName(documentResponseDto.getDetail().getScientificName())
					.uuid(documentResponseDto.getTurtleUUID())
					//.gender(documentResponseDto.getDetail().getGender())
					.gender(Gender.MALE)
					.dead(false)
					.build();

				turtleRepository.save(turtle);

				contractService.approveBreeding(document.getTurtleUUID(), document.getDocumentHash());
			}
			else if(document.getDocType() == DocType.DEATH){
				Turtle turtle = turtleService.findTurtleByUUID(document.getTurtleUUID());
				if(turtle == null){
					throw new TurtleNotFoundException("존재하지 않는 거북이 입니다.");
				}
				else{
					turtle.turtleDie();
				}
			}
			else if(document.getDocType() == DocType.TRANSFER){
				contractService.approveTransfer(document.getTurtleUUID(), document.getDocumentHash());
			}
		}
		else {
			if(!document.reject()){
				throw new DocumentProgressException("이미 검토 완료된 서류입니다.");
			}
		}
	}
}
