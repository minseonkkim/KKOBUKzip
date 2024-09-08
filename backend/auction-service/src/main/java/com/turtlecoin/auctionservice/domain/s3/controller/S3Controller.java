package com.turtlecoin.auctionservice.domain.s3.controller;

import com.turtlecoin.auctionservice.domain.s3.service.ImageUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class S3Controller {
	private final ImageUploadService imageUploadService;
	// 이미지 업로드를 테스트하기 위한 컨트롤러 이므로 실제 사용하지 말것
	@PostMapping(value = "/register/breed", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> registerBreedingDocument(
		@RequestPart("img1") MultipartFile img1,
		@RequestPart("img2") MultipartFile img2,
		@RequestPart("img3") MultipartFile img3) {

		// S3에 이미지를 업로드
		try{
			imageUploadService.upload(img1, "test");
			imageUploadService.upload(img2, "test");
			imageUploadService.upload(img3, "test");
		}catch (Exception e){
			e.printStackTrace();
		}

		// 응답
		return new ResponseEntity<>("Application with images received successfully!", HttpStatus.OK);
	}
}
