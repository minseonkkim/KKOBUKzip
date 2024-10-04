package com.turtlecoin.mainservice.domain.user.exception;

public class IssueTokenException extends Exception {
    private IssueTokenException() {}
    public IssueTokenException(String message) {super(message);}
    private IssueTokenException(String message, Throwable cause) {super(message, cause);}
    private IssueTokenException(Throwable cause) {super(cause);}
}
