package com.turtlecoin.mainservice.domain.s3.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.thoughtworks.xstream.core.BaseException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@PropertySource("classpath:s3.properties")
public class ImageUploadService {
	private final AmazonS3 amazonS3;

	// s3.properties 파일에서 받아 온 S3 버킷 이름
	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	@Value("cloud.aws.cloudFront")
	private String cloudFront;

	// MultipartFile을 받아 S3에 업로드하는 메서드
	public String upload(MultipartFile multipartFile, String dirName) throws IOException {
		// MultipartFile을 File 객체로 변환
		File uploadFile = convert(multipartFile)
			.orElseThrow(() -> new IllegalArgumentException("MultipartFile -> File 변환 실패"));
		// 변환된 파일을 S3에 업로드하고 URL을 반환
		return upload(uploadFile, dirName);
	}

	// File 객체를 S3에 업로드하고 URL을 반환하는 메서드
	private String upload(File uploadFile, String dirName) {
		// 업로드할 파일의 경로 설정
		String fileName = dirName + "/" + uploadFile.getName();
		// S3에 파일 업로드
		String uploadImageUrl = putS3(uploadFile, fileName);
		// 로컬 서버에서 임시 파일 삭제
		removeNewFile(uploadFile);
		// 업로드된 파일의 URL 반환
		return uploadImageUrl;
	}

	private String extractKeyNameFromUrl(String imageUrl) {
		// URL에서 버킷명과 경로를 추출
		// 예시: https://your-bucket.s3.amazonaws.com/path/to/image.jpg
		return imageUrl.replace("https://" + bucket + ".s3.amazonaws.com/", "");
	}
	public List<String> uploadMultiple(List<MultipartFile> multipartFiles, String dir) throws IOException {
		List<String> uploadedImageUrls = new ArrayList<>();
		for (MultipartFile multipartFile : multipartFiles) {
			String imageUrl = upload(multipartFile, dir);
			uploadedImageUrls.add(imageUrl);
		}
		return uploadedImageUrls;
	}

	// 로컬 서버에서 임시 파일을 삭제하는 메서드
	private void removeNewFile(File uploadFile) {
		uploadFile.delete();
	}

	// 파일을 S3에 업로드하고 URL을 반환하는 메서드
	private String putS3(File uploadFile, String fileName) {
		// S3에 파일 업로드 요청
		amazonS3.putObject(new PutObjectRequest(bucket, fileName, uploadFile)
			.withCannedAcl(CannedAccessControlList.PublicRead));
		// 업로드된 파일의 URL 반환
		//return cloudFront + fileName;
		return amazonS3.getUrl(bucket, fileName).toString();
	}

	// S3에서 파일 삭제하는 메서드
	public void deleteS3(String url) {
		try {
			String fileName = extractS3FileNameFromUrl(url);
			// 파일이 존재하는지 확인
			if (amazonS3.doesObjectExist(bucket, fileName)) {
				amazonS3.deleteObject(bucket, fileName);
			} else {
				return;
			}
		} catch (AmazonServiceException e) {
			// S3 서비스 관련 오류 처리
			System.err.println("AmazonServiceException: " + e.getErrorMessage());
		} catch (SdkClientException e) {
			// 클라이언트 측 오류 처리 (네트워크 문제 등)
			System.err.println("SdkClientException: " + e.getMessage());
		}
	}


	// MultipartFile을 File 객체로 변환하는 메서드
	private Optional<File> convert(MultipartFile file) throws IOException {
		// 원본 파일 이름 가져옴
		String originalFilename = file.getOriginalFilename();
		// UUID 생성
		String uuid = UUID.randomUUID().toString();
		// UUID와 원본 파일 이름을 조합하여 고유한 파일 이름 생성 -> 공백은 _로 변환
		String uuidFileName = uuid + "_" + originalFilename.replaceAll("\\s", "_");

		// 변환 할 파일 객체 생성
		File convertFile = new File(uuidFileName);
		// 새로운 파일 생성 시도
		if (convertFile.createNewFile()) {
			try (FileOutputStream fos = new FileOutputStream(convertFile)) {
				fos.write(file.getBytes());
			}
			return Optional.of(convertFile);
		}
		return Optional.empty();
	}

	// S3 URL에서 파일 경로를 추출하는 메서드
	private String extractS3FileNameFromUrl(String s3Url) {
		try {
			URL url = new URL(s3Url);
			String path = url.getPath(); // /bucket-name/path/to/file
			// CloudFront 경로에 맞게 조정할 수 있음
			return path.startsWith("/") ? path.substring(1) : path;
		} catch (Exception e) {
			throw new RuntimeException("URL 파싱 중 오류 발생", e);
		}
	}
}
