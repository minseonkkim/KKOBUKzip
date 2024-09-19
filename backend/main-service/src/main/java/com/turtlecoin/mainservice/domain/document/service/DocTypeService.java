package com.turtlecoin.mainservice.domain.document.service;

import org.springframework.stereotype.Service;

import com.turtlecoin.mainservice.domain.document.entity.DocType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocTypeService {

	public String convertToString(DocType docType) {
		switch (docType){
			case BREEDING:
				return "인공증식증명서";
			case DEATH:
				return "폐사질병신고서";
			default:
				return "양도양수확인서";
		}
	}

	public DocType convertFromString(String docTypeStr) {
		switch (docTypeStr){
			case "인공증식증명서":
				return DocType.BREEDING;
			case "폐사질병신고서":
				return DocType.DEATH;
			default:
				return DocType.TRANSFER;
		}
	}
}
