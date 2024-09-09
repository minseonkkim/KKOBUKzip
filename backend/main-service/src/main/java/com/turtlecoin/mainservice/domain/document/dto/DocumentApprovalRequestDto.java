package com.turtlecoin.mainservice.domain.document.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class DocumentApprovalRequestDto {
	private String documentHash;
	private String turtleUUID;
	private boolean flag;
}
