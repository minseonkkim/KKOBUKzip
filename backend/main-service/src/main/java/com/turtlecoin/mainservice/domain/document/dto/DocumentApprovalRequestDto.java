package com.turtlecoin.mainservice.domain.document.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DocumentApprovalRequestDto {
	private String documentHash;
	private String turtleUUID;
	private boolean approval;
}
