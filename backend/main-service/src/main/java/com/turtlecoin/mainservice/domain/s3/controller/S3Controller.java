package com.turtlecoin.mainservice.domain.s3.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.turtlecoin.mainservice.domain.s3.service.ImageUploadService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class S3Controller {
	private final ImageUploadService imageUploadService;
	// 이미지 업로드를 테스트하기 위한 컨트롤러 이므로 실제 사용하지 말것
	@PostMapping(value = "/upload/s3", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> registerBreedingDocument(
		@RequestPart("img1") MultipartFile img1,
		@RequestPart("img2") MultipartFile img2,
		@RequestPart("img3") MultipartFile img3) {
		Map<String, String> result = new HashMap<>();

		// S3에 이미지를 업로드
		try{
			result.put("img1", imageUploadService.upload(img1, "test"));
			result.put("img2", imageUploadService.upload(img2, "test"));
			result.put("img3", imageUploadService.upload(img3, "test"));
		}catch (Exception e){
			//e.printStackTrace();
		}

		// 응답
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@PostMapping(value = "/delete/s3")
	public ResponseEntity<?> deleteS3(@RequestBody Map<String, String> data){
		String url = data.get("url");
		imageUploadService.deleteS3(url);

		return new ResponseEntity<>("Image deleted successfully!", HttpStatus.OK);
	}
}
