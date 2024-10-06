package com.turtlecoin.mainservice.global.util;

import java.security.Principal;

import lombok.Getter;
import lombok.Setter;

public class CustomPrincipal implements Principal {
	private final String name;
	@Getter
	@Setter
	private String roomId;

	public CustomPrincipal(String name) {
		this.name = name;
	}

	@Override
	public String getName() {
		return name;  // 여기서 userId를 반환
	}
}
