package com.turtlecoin.mainservice.global.exception;

public class NoTurtleFoundException extends RuntimeException {
    public NoTurtleFoundException() {
        super("No turtle found");
    }
}
