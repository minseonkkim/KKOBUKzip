package com.turtlecoin.mainservice.global.exception;

public class RedisSaveException extends Exception{
    public RedisSaveException(){}
    public RedisSaveException(String message) {super(message);}
    public RedisSaveException(String message, Throwable cause) {super(message, cause);}
    public RedisSaveException(Throwable cause) {super(cause);}
}
