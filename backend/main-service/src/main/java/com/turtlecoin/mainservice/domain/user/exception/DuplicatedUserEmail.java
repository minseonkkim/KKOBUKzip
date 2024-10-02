package com.turtlecoin.mainservice.domain.user.exception;

public class DuplicatedUserEmail extends Exception {
    public DuplicatedUserEmail(){}
    public DuplicatedUserEmail(String message) {super(message);}
    public DuplicatedUserEmail(String message, Throwable cause) {super(message, cause);}
    public DuplicatedUserEmail(Throwable cause) {super(cause);}
}
