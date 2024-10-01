package com.turtlecoin.mainservice.domain.user.exception;

public class VerificationNotFoundException extends RuntimeException {
    public VerificationNotFoundException() {}
    public VerificationNotFoundException(String message) {super(message);}
    public VerificationNotFoundException(String message, Throwable cause) {super(message, cause);}
    public VerificationNotFoundException(Throwable cause) {super(cause);}

}
