package com.turtlecoin.mainservice.global.response;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.Setter;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
public class ResponseVO<T> {
	private String status;
	private Map<String, T> data;
	private String message;

	public ResponseVO() {
	}

	public ResponseVO(String status, String message, Map<String, T> data) {
		this.status = status;
		this.message = message;
		this.data = data;
	}

	public static <T> ResponseVO<T> success(String message) {
		return new ResponseVO<>("200", message, null);
	}

	public static <T> ResponseVO<T> success(String message, String name, T data) {
		Map<String, T> dataMap = new HashMap<>();
		dataMap.put(name, data);
		return new ResponseVO<>("200", message, dataMap);
	}

	public static <T> ResponseVO<T> success(String name, T data) {
		Map<String, T> dataMap = new HashMap<>();
		dataMap.put(name, data);
		return new ResponseVO<>("200", "Success", dataMap);
	}

	public static <T> ResponseVO<T> failure(String status,String message) {
		return new ResponseVO<>(status, message, null);
	}
}
