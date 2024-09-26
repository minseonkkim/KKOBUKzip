package com.turtlecoin.mainservice.global.response;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.Setter;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
public class ResponseSingle<T> {
	private String status;
	private T data;
	private String message;

	public ResponseSingle() {
	}

	public ResponseSingle(String status, String message, T data) {
		this.status = status;
		this.message = message;
		this.data = data;
	}

	public static <T> ResponseSingle<T> success(String message) {
		return new ResponseSingle<>("200", message, null);
	}

	public static <T> ResponseSingle<T> success(String message, T data) {
		return new ResponseSingle<>("200", message, data);
	}

	public static <T> ResponseVO<T> failure(String status, String message) {
		return new ResponseVO<>(status, message, null);
	}
}
