package com.turtlecoin.auctionservice.global.exception;

public class BidConcurrencyException extends RuntimeException {
    public BidConcurrencyException(String message) {
        super(message);
    }

    public BidConcurrencyException(String message, Throwable cause){
        super(message, cause);
    }

    public BidConcurrencyException(Throwable cause){
        super(cause);
    }

    public BidConcurrencyException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
