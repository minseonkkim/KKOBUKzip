package com.turtlecoin.auctionservice.global.exception;

public class BidNotValidException extends RuntimeException {
    public BidNotValidException(String message) {
        super(message);
    }

    public BidNotValidException(String message, Throwable cause){
        super(message, cause);
    }

    public BidNotValidException(Throwable cause){
        super(cause);
    }

    public BidNotValidException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
