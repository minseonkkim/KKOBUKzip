package com.turtlecoin.mainservice.global.exception;

public class S3SaveException extends Exception{
    public S3SaveException() {}
    public S3SaveException(String message) {super(message);}
    public S3SaveException(String message, Throwable cause) {super(message, cause);}
    public S3SaveException(Throwable cause) {super(cause);}
}
