package com.turtlecoin.mainservice.domain.document.dto;

import com.turtlecoin.mainservice.domain.document.entity.DocType;
import com.turtlecoin.mainservice.domain.document.entity.Progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
public class TempDto {
	private String documentHash;
	private String turtleUUID;
	private DocType docType;
}
