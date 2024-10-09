package com.turtlecoin.mainservice.domain.document.controller;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.turtlecoin.mainservice.domain.document.dto.AssignDocumentRequest;
import com.turtlecoin.mainservice.domain.document.dto.BreedingDocumentRequest;
import com.turtlecoin.mainservice.domain.document.dto.DeathDocumentRequest;
import com.turtlecoin.mainservice.domain.document.dto.DocumentApprovalRequestDto;
import com.turtlecoin.mainservice.domain.document.dto.DocumentListDto;
import com.turtlecoin.mainservice.domain.document.dto.DocumentResponseDto;
import com.turtlecoin.mainservice.domain.document.dto.GrantDocumentRequest;
import com.turtlecoin.mainservice.domain.document.entity.DocType;
import com.turtlecoin.mainservice.domain.document.entity.Document;
import com.turtlecoin.mainservice.domain.document.entity.Progress;
import com.turtlecoin.mainservice.domain.document.repository.DocumentRepository;
import com.turtlecoin.mainservice.domain.document.service.ContractService;
import com.turtlecoin.mainservice.domain.document.service.DocumentService;
import com.turtlecoin.mainservice.domain.s3.service.ImageUploadService;
import com.turtlecoin.mainservice.domain.transaction.entity.Transaction;
import com.turtlecoin.mainservice.domain.transaction.exception.TransactionNotFoundException;
import com.turtlecoin.mainservice.domain.transaction.service.TransactionService;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import com.turtlecoin.mainservice.domain.turtle.service.TurtleService;
import com.turtlecoin.mainservice.domain.user.entity.Role;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.service.UserService;
import com.turtlecoin.mainservice.domain.user.util.JWTUtil;
import com.turtlecoin.mainservice.global.exception.DocumentNotFoundException;
import com.turtlecoin.mainservice.global.exception.DocumentProgressException;
import com.turtlecoin.mainservice.global.exception.NotTransferDocumentException;
import com.turtlecoin.mainservice.global.exception.TurtleDeadException;
import com.turtlecoin.mainservice.global.exception.TurtleNotFoundException;
import com.turtlecoin.mainservice.domain.user.exception.UserNotFoundException;
import com.turtlecoin.mainservice.global.response.ResponseSingle;
import com.turtlecoin.mainservice.global.response.ResponseVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/main/document")
public class DocumentController {
	private final ImageUploadService imageUploadService;
	private final DocumentService documentService;
	private final ContractService contractService;
	private final UserService userService;
	private final TurtleService turtleService;
	private final DocumentRepository documentRepository;
	private final JWTUtil jwtUtil;
	private final TransactionService transactionService;

	// 인공증식서류 등록
	@PostMapping(value = "/register/breed", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> registerBreedingDocument(
		@RequestPart("data") BreedingDocumentRequest requestData,
		@RequestPart("locationSpecification") MultipartFile locationSpecification,
		@RequestPart("multiplicationMethod") MultipartFile multiplicationMethod,
		@RequestPart("shelterSpecification") MultipartFile shelterSpecification) {

		String locationSpecificationAddress = "";
		String multiplicationAddress = "";
		String shelterSpecificationAddress = "";

		if(!requestData.isValid() || locationSpecification == null || multiplicationMethod == null || shelterSpecification == null) {
			return new ResponseEntity<>(ResponseVO.failure("400", "포함되지 않은 항목이 있습니다."), HttpStatus.BAD_REQUEST);
		}

		try{
			// 신청자 정보가 DB에 없는 경우 에러
			String applicant = requestData.getApplicant();
			if(userService.getUserByUUID(applicant) == null){
				throw new UserNotFoundException("신청자 정보와 일치하는 회원이 존재하지 않습니다.");
			}
			String motherUUID = requestData.getDetail().getMotherUUID();
			String fatherUUID = requestData.getDetail().getFatherUUID();
			Turtle father = turtleService.findTurtleByUUID(fatherUUID);
			Turtle mother = turtleService.findTurtleByUUID(motherUUID);

			if(father == null || mother == null){
				throw new TurtleNotFoundException("존재하지 않는 부모 개체입니다.");
			}
			else if(father != null && father.isDead()){
				throw new TurtleDeadException("부모 개체가 이미 폐사한 상태입니다.");
			}
			else if(mother != null && mother.isDead()){
				throw new TurtleDeadException("부모 개체가 이미 폐사한 상태입니다.");
			}
		}
		catch(UserNotFoundException | TurtleNotFoundException e){
			return new ResponseEntity<>(ResponseVO.failure("404", e.getMessage()), HttpStatus.NOT_FOUND);
		}
		catch(TurtleDeadException e){
			return new ResponseEntity<>(ResponseVO.failure("400", e.getMessage()), HttpStatus.BAD_REQUEST);
		}
		catch (Exception e){
			return new ResponseEntity<>(ResponseVO.failure("500", "데이터 검증 중 오류 발생"), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		String turtleUUID = "";
		String currentVariable = "";
		String documentHash = "";
		// DB에 데이터를 먼저 저장
		try{
			turtleUUID = UUID.randomUUID().toString();
			currentVariable = requestData.getApplicant() + turtleUUID + Long.toString(System.currentTimeMillis());
			documentHash = contractService.keccak256(currentVariable.getBytes());

			Document document = Document.builder()
				.documentHash(documentHash)
				.progress(Progress.DOCUMENT_REVIEWING)
				.turtleUUID(turtleUUID)
				.docType(DocType.BREEDING)
				.applicant(null)
				.build();

			documentService.save(document);
		}
		catch(Exception e){
			// 로직중 에러가 발생하면 모두 처음으로 복구시킨다.
			// e.printStackTrace();
			return new ResponseEntity<>(ResponseVO.failure("500", "데이터 저장 중 오류가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		// S3에 이미지를 업로드
		try{
			locationSpecificationAddress = imageUploadService.upload(locationSpecification, "breedDocument");
			multiplicationAddress = imageUploadService.upload(multiplicationMethod, "breedDocument");
			shelterSpecificationAddress = imageUploadService.upload(shelterSpecification, "breedDocument");
		}catch (Exception e){
			//e.printStackTrace();
			// 로직중 에러가 발생하면 모두 처음으로 복구시킨다.
			imageUploadService.deleteS3(locationSpecificationAddress);
			imageUploadService.deleteS3(multiplicationAddress);
			imageUploadService.deleteS3(shelterSpecificationAddress);

			documentService.removeDocument(documentHash, turtleUUID);

			return new ResponseEntity<>(ResponseVO.failure("500", "이미지 업로드 중 오류 발생"), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// 블록체인에 업로드
		try{
			contractService.registerTurtleMultiplicationDocumentAsync(
				turtleUUID, requestData.getApplicant(), documentHash, BigInteger.valueOf(requestData.getDetail().getCount()), requestData.getDetail().getArea(),
				requestData.getDetail().getPurpose(), requestData.getDetail().getLocation(), requestData.getDetail().getFatherUUID(),
				requestData.getDetail().getMotherUUID(), requestData.getDetail().getBirth(), requestData.getDetail().getName(), requestData.getDetail().getWeight(), requestData.getDetail().getGender(),
				locationSpecificationAddress, multiplicationAddress, shelterSpecificationAddress
			);
		}
		catch(Exception e){
			//e.printStackTrace();
			// 로직중 에러가 발생하면 모두 처음으로 복구시킨다.
			imageUploadService.deleteS3(locationSpecificationAddress);
			imageUploadService.deleteS3(multiplicationAddress);
			imageUploadService.deleteS3(shelterSpecificationAddress);

			documentService.removeDocument(documentHash, turtleUUID);

			return new ResponseEntity<>(ResponseVO.failure("500", "블록체인 접근 중 오류 발생"), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// 응답
		return new ResponseEntity<>(ResponseVO.success("서류 등록에 성공했습니다."), HttpStatus.OK);
	}

	// 양수신청서 등록
	@PostMapping(value = "/register/assign", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> registerAssignDocument(@RequestBody AssignDocumentRequest requestData) {
		String turtleUUID = "";
		String documentHash = "";
		String assigneeUUID = "";

		if(!requestData.isValid()){
			return new ResponseEntity<>(ResponseVO.failure("400", "포함되지 않은 항목이 있습니다."), HttpStatus.BAD_REQUEST);
		}

		// 신청자 정보가 DB에 없는 경우 에러
		try{
			String applicant = requestData.getApplicant();
			if(userService.getUserByUUID(applicant) == null){
				throw new UserNotFoundException("신청자 정보와 일치하는 회원이 존재하지 않습니다.");
			}
			// 거북이 일치하지 않으면 에러
			turtleUUID = requestData.getDetail().getTurtleUUID();
			Turtle turtle = turtleService.findTurtleByUUID(turtleUUID);
			if(turtle == null){
				throw new TurtleNotFoundException("존재하지 않는 거북이 입니다.");
			}
			else if(turtle.isDead()){
				throw new TurtleDeadException("개체가 이미 폐사한 상태입니다.");
			}


			String currentVariable = requestData.getApplicant() + turtleUUID + Long.toString(System.currentTimeMillis());
			documentHash = contractService.keccak256(currentVariable.getBytes());
			// 이름 전화번호로 사용자 검색하고 없으면 에러
			User assignee = userService.getUserByNameAndPhoneNumber(requestData.getDetail().getAssignee().getName(), requestData.getDetail().getAssignee().getPhoneNumber());
			if(assignee == null){
				throw new UserNotFoundException("양수인 정보와 일치하는 회원이 존재하지 않습니다.");
			}
			assigneeUUID = assignee.getUuid();
			// 거래에 서류 정보를 할당하기
			transactionService.setDocumentHash(requestData.getTransactionId(), documentHash);
		}
		catch(UserNotFoundException | TransactionNotFoundException | TurtleNotFoundException e){
			return new ResponseEntity<>(ResponseVO.failure("404", e.getMessage()), HttpStatus.NOT_FOUND);
		}
		catch(TurtleDeadException e){
			return new ResponseEntity<>(ResponseVO.failure("400", e.getMessage()), HttpStatus.BAD_REQUEST);
		}
		catch(Exception e){
			return new ResponseEntity<>(ResponseVO.failure("500", "데이터 검증 중 오류가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// DB에 먼저 데이터 저장
		try{
			Document document = Document.builder()
				.documentHash(documentHash)
				.progress(Progress.DOCUMENT_REVIEWING)
				.turtleUUID(turtleUUID)
				.docType(DocType.TRANSFER)
				.applicant(null)
				.build();
			documentService.save(document);
		}
		catch(Exception e){
			return new ResponseEntity<>(ResponseVO.failure("500", "데이터 저장 중 오류가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// 블록체인에 업로드
		try{
			contractService.registerTurtleAssigneeDocumentAsync(
				turtleUUID, requestData.getApplicant(), documentHash, assigneeUUID, BigInteger.valueOf(requestData.getDetail().getCount()),
				requestData.getDetail().getTransferReason(), requestData.getDetail().getPurpose(), BigInteger.valueOf(requestData.getTransactionId())
			);
		}
		catch(Exception e){
			//e.printStackTrace();
			documentService.removeDocument(documentHash, turtleUUID);
			return new ResponseEntity<>(ResponseVO.failure("500", "블록체인 접근 중 오류 발생"), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// 응답
		return new ResponseEntity<>(ResponseVO.success("서류 등록에 성공했습니다."), HttpStatus.OK);
	}

	// 양도신청서 등록
	@PostMapping(value = "/register/grant", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> registerGrantDocument(@RequestBody GrantDocumentRequest requestData) {
		String turtleUUID = "";
		String documentHash = "";
		String grantorUUID = "";
		if(!requestData.isValid()){
			return new ResponseEntity<>(ResponseVO.failure("400", "포함되지 않은 항목이 있습니다."), HttpStatus.BAD_REQUEST);
		}
		// 신청자 정보가 DB에 없는 경우 에러
		try{
			String applicant = requestData.getApplicant();
			if(userService.getUserByUUID(applicant) == null){
				throw new UserNotFoundException("신청자 정보와 일치하는 회원이 존재하지 않습니다.");
			}
			turtleUUID = requestData.getDetail().getTurtleUUID();
			Turtle turtle = turtleService.findTurtleByUUID(turtleUUID);
			if(turtle == null){
				throw new TurtleNotFoundException("존재하지 않는 거북이 입니다.");
			}
			else if(turtle.isDead()){
				throw new TurtleDeadException("개체가 이미 폐사한 상태입니다.");
			}

			documentHash = requestData.getDocumentHash();
			Optional<Document> document = documentRepository.findByDocumentHashAndTurtleUUID(documentHash, turtleUUID);
			if(document.isEmpty()){
				throw new DocumentNotFoundException("입력한 정보와 일치하는 양수 신청서가 존재하지 않습니다.");
			}
			else if(document.get().getDocType() != DocType.TRANSFER){
				throw new NotTransferDocumentException("입력한 정보가 양수 신청서의 것이 아닙니다.");
			}
			// 이름 전화번호로 사용자 검색하기
			User grantor = userService.getUserByNameAndPhoneNumber(requestData.getDetail().getGrantor().getName(), requestData.getDetail().getGrantor().getPhoneNumber());
			if(grantor == null){
				throw new UserNotFoundException("양도인 정보와 일치하는 회원이 존재하지 않습니다.");
			}
			grantorUUID = grantor.getUuid();
		}
		catch(UserNotFoundException | TurtleNotFoundException | DocumentNotFoundException e){
			return new ResponseEntity<>(ResponseVO.failure("404", e.getMessage()), HttpStatus.NOT_FOUND);
		}
		catch(NotTransferDocumentException | TurtleDeadException e){
			return new ResponseEntity<>(ResponseVO.failure("400", e.getMessage()), HttpStatus.BAD_REQUEST);
		}
		catch(Exception e){
			return new ResponseEntity<>(ResponseVO.failure("500", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		// 블록체인에 업로드 ( 미구현 )
		try{
			contractService.registerTurtleGrantorDocumentAsync(
				turtleUUID, requestData.getApplicant(), requestData.getDocumentHash(), grantorUUID, requestData.getDetail().getAquisition(),
				requestData.getDetail().getFatherUUID(), requestData.getDetail().getMotherUUID()
			);
		}
		catch(Exception e){
			//e.printStackTrace();
			return new ResponseEntity<>(ResponseVO.failure("500", "블록체인 접근 중 오류 발생"), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// 응답
		return new ResponseEntity<>(ResponseVO.success("서류 등록에 성공했습니다."), HttpStatus.OK);
	}

	// 폐사질병서류 등록
	@PostMapping(value = "/register/death", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> registerDeathDocument(
		@RequestPart("data") DeathDocumentRequest requestData,
		@RequestPart("deathImage") MultipartFile deathImage,
		@RequestPart("diagnosis") MultipartFile diagnosis) {
		if(!requestData.isValid() || deathImage == null || diagnosis == null) {
			return new ResponseEntity<>(ResponseVO.failure("400", "포함되지 않은 항목이 있습니다."), HttpStatus.BAD_REQUEST);
		}

		String deathImageAddress = "";
		String diagnosisAddress = "";
		String turtleUUID = "";
		String currentVariable = "";
		String documentHash = "";
		// 신청자 정보가 DB에 없는 경우 에러
		try{
			String applicant = requestData.getApplicant();
			if(userService.getUserByUUID(applicant) == null){
				throw new UserNotFoundException("신청자 정보와 일치하는 회원이 존재하지 않습니다.");
			}
		}
		catch(UserNotFoundException e){
			return new ResponseEntity<>(ResponseVO.failure("404", e.getMessage()), HttpStatus.NOT_FOUND);
		}

		// 거북이 일치 확인
		try{
			turtleUUID = requestData.getDetail().getTurtleUUID();
			currentVariable = requestData.getApplicant() + turtleUUID + Long.toString(System.currentTimeMillis());
			documentHash = contractService.keccak256(currentVariable.getBytes());

			Turtle turtle = turtleService.findTurtleByUUID(turtleUUID);
			if(turtle == null){
				throw new TurtleNotFoundException("존재하지 않는 거북이 입니다.");
			}
			else if(turtle.isDead()){
				throw new TurtleDeadException("개체가 이미 폐사한 상태입니다.");
			}
		}
		catch(TurtleNotFoundException e){
			return new ResponseEntity<>(ResponseVO.failure("404", e.getMessage()), HttpStatus.NOT_FOUND);
		}
		catch(TurtleDeadException e){
			return new ResponseEntity<>(ResponseVO.failure("400", e.getMessage()), HttpStatus.BAD_REQUEST);
		}
		catch(Exception e){
			return new ResponseEntity<>(ResponseVO.failure("500", "데이터 검증 중 오류가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		// DB에 우선 데이터 저장
		try{
			Document document = Document.builder()
				.documentHash(documentHash)
				.progress(Progress.DOCUMENT_REVIEWING)
				.turtleUUID(turtleUUID)
				.docType(DocType.DEATH)
				.applicant(null)
				.build();
			documentService.save(document);
		}
		catch(Exception e){
			return new ResponseEntity<>(ResponseVO.failure("500", "데이터 저장 중 오류가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		// S3에 이미지를 업로드
		try{
			deathImageAddress = imageUploadService.upload(deathImage, "deathDocument");
			diagnosisAddress = imageUploadService.upload(diagnosis, "deathDocument");
		}
		catch (Exception e){
			//e.printStackTrace();
			// 로직중 에러가 발생하면 모두 처음으로 복구시킨다.
			imageUploadService.deleteS3(deathImageAddress);
			imageUploadService.deleteS3(diagnosisAddress);

			return new ResponseEntity<>(ResponseVO.failure("500", "이미지 업로드 중 오류 발생"), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		try{
			contractService.registerTurtleDeathDocumentAsync(
				turtleUUID, requestData.getApplicant(), documentHash, requestData.getDetail().getShelter(), BigInteger.valueOf(requestData.getDetail().getCount()), requestData.getDetail().getDeathReason(),
				requestData.getDetail().getPlan(), deathImageAddress, deathImageAddress
			);
		}
		catch(Exception e){
			//e.printStackTrace();
			// 로직중 에러가 발생하면 모두 처음으로 복구시킨다.
			imageUploadService.deleteS3(deathImageAddress);
			imageUploadService.deleteS3(diagnosisAddress);
			return new ResponseEntity<>(ResponseVO.failure("500", "블록체인 접근 중 오류 발생"), HttpStatus.INTERNAL_SERVER_ERROR);
		}


		// 응답
		return new ResponseEntity<>(ResponseVO.success("서류 등록에 성공했습니다."), HttpStatus.OK);
	}

	// 관리자용 메뉴이므로 인증 해줘야함
	// 전체 서류 조회
	@GetMapping("/list")
	public ResponseEntity<?> listDocuments(@RequestHeader HttpHeaders header, Pageable pageable) {
		List<DocumentListDto> documentList;

		try{
			String accessToken = header.getFirst("Authorization").split("Bearer ")[1].split(" ")[0];
			Role role = Role.valueOf(jwtUtil.getRoleFromToken(accessToken));

			if(role != Role.ROLE_ADMIN){
				return new ResponseEntity<>(ResponseVO.failure("401", "관리자만 접근 가능합니다."), HttpStatus.UNAUTHORIZED);
			}

			// 관리자가 확인 중인 서류를 모두 조회
			documentList = documentService.getDocumentList(pageable);
		}catch(Exception e){
			e.printStackTrace();
			return new ResponseEntity<>(ResponseVO.failure("500", "서류 조회에 실패했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<>(ResponseSingle.success("서류 목록 조회에 성공하였습니다.", documentList), HttpStatus.OK);
	}
	
	// 서류 상세 조회
	@GetMapping("/{turtleUUID}/{documentHash}")
	public ResponseEntity<?> getDocument(
		@PathVariable(value = "turtleUUID") String turtleUUID,
		@PathVariable(value = "documentHash") String documentHash) {
		DocumentResponseDto documentResponseDto;

		try{
			documentResponseDto = documentService.responseDocument(documentHash, turtleUUID);
			if(documentResponseDto == null){
				throw new DocumentNotFoundException("입력한 정보와 일치하는 서류가 존재하지 않습니다.");
			}
		}
		catch(DocumentNotFoundException e){
			return new ResponseEntity<>(ResponseVO.failure("404", e.getMessage()), HttpStatus.NOT_FOUND);
		}
		catch(Exception e){
			//e.printStackTrace();
			return new ResponseEntity<>(ResponseVO.failure("500", "서류 조회 중 오류가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<>(ResponseSingle.success("서류 상세 조회에 성공하였습니다.", documentResponseDto), HttpStatus.OK);
	}

	// 서류 승인 또는 반려
	@PostMapping("/approve")
	public ResponseEntity<?> approveDocument(@RequestHeader HttpHeaders header,  @RequestBody DocumentApprovalRequestDto documentApprovalRequestDto) {
		DocumentResponseDto documentResponseDto;
		try{
			String accessToken = header.getFirst("Authorization").split("Bearer ")[1].split(" ")[0];
			Role role = Role.valueOf(jwtUtil.getRoleFromToken(accessToken));

			if(role != Role.ROLE_ADMIN){
				return new ResponseEntity<>(ResponseVO.failure("401", "관리자만 접근 가능합니다."), HttpStatus.UNAUTHORIZED);
			}

			documentResponseDto = documentService.responseDocument(documentApprovalRequestDto.getDocumentHash(), documentApprovalRequestDto.getTurtleUUID());
			if(documentResponseDto == null){
				throw new DocumentNotFoundException("입력한 정보와 일치하는 서류가 존재하지 않습니다.");
			}
			documentService.approveDocument(documentApprovalRequestDto);
		}
		catch(DocumentNotFoundException | UserNotFoundException | TurtleNotFoundException e){
			return new ResponseEntity<>(ResponseVO.failure("404", e.getMessage()), HttpStatus.NOT_FOUND);
		}
		catch(DocumentProgressException e){
			return new ResponseEntity<>(ResponseVO.failure("409", e.getMessage()), HttpStatus.CONFLICT);
		}
		catch(Exception e){
			return new ResponseEntity<>(ResponseVO.failure("500", "서류 처리 중 오류가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<>(ResponseVO.success("서류 처리에 성공했습니다."), HttpStatus.OK);
	}

	@PostMapping(value = "/register/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> registerPhoto(@RequestPart(value = "turtleImg") MultipartFile multipartFile) {
		String imageAddress = "";

		// 이미지가 비어 있는지 확인
		if (multipartFile == null || multipartFile.isEmpty()) {
			return new ResponseEntity<>(ResponseVO.failure("400", "이미지가 첨부되지 않았습니다."), HttpStatus.BAD_REQUEST);
		}

		// S3에 이미지 업로드
		try {
			imageAddress = imageUploadService.upload(multipartFile, "turtlePhoto");
		} catch (Exception e) {
			// S3 업로드 중 오류 발생 시 처리
			return new ResponseEntity<>(ResponseVO.failure("500", "이미지 업로드 중 오류가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// 성공적으로 이미지가 업로드되었을 때, S3 주소 반환
		return new ResponseEntity<>(ResponseSingle.success("이미지 등록에 성공했습니다.", imageAddress), HttpStatus.OK);
	}
}
