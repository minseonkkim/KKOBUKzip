package com.turtlecoin.auctionservice.global.exception;

public class MissingHeaderException extends RuntimeException {
    public MissingHeaderException(String message) {
        super(message);
    }

    public MissingHeaderException(String message, Throwable cause){
        super(message, cause);
    }

    public MissingHeaderException(Throwable cause){
        super(cause);
    }

    public MissingHeaderException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
