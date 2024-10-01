package com.turtlecoin.mainservice.domain.user.exception;

public class WrongVerificationCodeException extends RuntimeException {
    public WrongVerificationCodeException() {}
    public WrongVerificationCodeException(String message) {super(message);}
    public WrongVerificationCodeException(String message, Throwable cause) {super(message, cause);}
    public WrongVerificationCodeException(Throwable cause) {super(cause);}
}
