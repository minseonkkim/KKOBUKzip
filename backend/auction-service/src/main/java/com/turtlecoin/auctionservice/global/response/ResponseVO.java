package com.turtlecoin.auctionservice.global.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
public class ResponseVO<T> {
    private String type;
    private String status;
    private Map<String, T> data;
    private String message;

    public ResponseVO() {
    }

    public ResponseVO(String status, Map<String, T> data) {
        this.status = status;
        this.data = data;
    }

    public ResponseVO(String status, String message, Map<String, T> data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public ResponseVO(String type, String status, String message, Map<String, T> data) {
        this.type = type;
        this.status = status;
        this.message = message;
        this.data = data;
    }


    public static <T> ResponseVO<T> success(String message) {
        return new ResponseVO<>("200", message, null);
    }

    public static <T> ResponseVO<T> success(String status, String message) {
        return new ResponseVO<>(status, message, null);
    }

    public static <T> ResponseVO<T> bidSuccess(String type, String status, T data) {
        Map<String, T> dataMap = new HashMap<>();
        dataMap.put(type, data);
        return new ResponseVO<>(status, dataMap);
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

    public static <T> ResponseVO<T> failure(String type, String status, String message) {
        return new ResponseVO<>(type, status, message, null);
    }
}
