package com.turtlecoin.auctionservice.global;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.Setter;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
public class ResponseVO<T> {
    private boolean success;
    private Map<String, T> data;
    private String message;
    private String error;

    public ResponseVO() {
    }

    public ResponseVO(boolean success, String message, Map<String, T> data, String error) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.error = error;
    }

    public static <T> ResponseVO<T> success(String message) {
        return new ResponseVO<>(true, message, null, null);
    }

    public static <T> ResponseVO<T> success(String message, String name, T data) {
        Map<String, T> dataMap = new HashMap<>();
        dataMap.put(name, data);
        return new ResponseVO<>(true, message, dataMap, null);
    }

    public static <T> ResponseVO<T> success(String name, T data) {
        Map<String, T> dataMap = new HashMap<>();
        dataMap.put(name, data);
        return new ResponseVO<>(true, "Success", dataMap, null);
    }

    public static <T> ResponseVO<T> failure(String message, String error) {
        return new ResponseVO<>(false, message, null, error);
    }
}
