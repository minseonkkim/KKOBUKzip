package com.turtlecoin.mainservice.domain.document.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.turtlecoin.mainservice.domain.document.dto.BreedingDocumentRequest;
import com.turtlecoin.mainservice.domain.document.dto.TempDto;
import com.turtlecoin.mainservice.domain.document.service.DocumentService;
import com.turtlecoin.mainservice.domain.s3.service.ImageUploadService;
import com.turtlecoin.mainservice.global.response.ResponseVO;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/main/document")
public class DocumentController {
	private final ImageUploadService imageUploadService;
	private final DocumentService documentService;

	// 인공증식서류 등록
	@PostMapping(value = "/register/breed", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> registerBreedingDocument(
		@RequestPart("data") BreedingDocumentRequest requestData,
		@RequestPart("locationSpecification") MultipartFile locationSpecification,
		@RequestPart("multiplicationMethod") MultipartFile multiplicationMethod,
		@RequestPart("shelterSpecification") MultipartFile shelterSpecification) {

		String img1Address = "";
		String img2Address = "";
		String img3Address = "";

		// S3에 이미지를 업로드
		try{
			img1Address = imageUploadService.upload(locationSpecification, "breedDocument");
			img2Address = imageUploadService.upload(multiplicationMethod, "breedDocument");
			img3Address = imageUploadService.upload(shelterSpecification, "breedDocument");
		}catch (Exception e){
			//e.printStackTrace();
			// 로직중 에러가 발생하면 모두 처음으로 복구시킨다.
			imageUploadService.deleteS3(img1Address);
			imageUploadService.deleteS3(img2Address);
			imageUploadService.deleteS3(img3Address);

			return new ResponseEntity<>(ResponseVO.failure("서류 등록에 실패했습니다.", e.getMessage()), HttpStatus.BAD_REQUEST);
		}

		String hash = "";
		String turtleHash = "";
		// 블록체인에 업로드 ( 미구현 )
		try{
			hash = UUID.randomUUID().toString();
			turtleHash = UUID.randomUUID().toString();
		}
		catch(Exception e){
			//e.printStackTrace();
			// 로직중 에러가 발생하면 모두 처음으로 복구시킨다.
			imageUploadService.deleteS3(img1Address);
			imageUploadService.deleteS3(img2Address);
			imageUploadService.deleteS3(img3Address);
			return new ResponseEntity<>(ResponseVO.failure("서류 등록에 실패했습니다.", e.getMessage()), HttpStatus.BAD_REQUEST);
		}

		// DB에 최종적으로 데이터 저장
		try{

		}catch(Exception e){

		}

		// 응답
		return new ResponseEntity<>(ResponseVO.success("서류 등록에 성공했습니다."), HttpStatus.OK);
	}

	@GetMapping("/{turtleUUID}/{documentHash}")
	public ResponseEntity<?> getDocument(
		@PathVariable(value = "turtleUUID") String turtleUUID,
		@PathVariable(value = "documentHash") String documentHash) {

		TempDto tempDto = documentService.getDocument(documentHash, turtleUUID);

		return new ResponseEntity<>(ResponseVO.success("메시지", tempDto), HttpStatus.OK);
	}
}
