package com.turtlecoin.mainservice.domain.transaction.exception;

public class DuplicatedEnrollTransaction extends RuntimeException {
    public DuplicatedEnrollTransaction() {}
    public DuplicatedEnrollTransaction(String message) {super(message);}
    public DuplicatedEnrollTransaction(String message, Throwable cause) {super(message, cause);}
    public DuplicatedEnrollTransaction(Throwable cause) {super(cause);}
}
