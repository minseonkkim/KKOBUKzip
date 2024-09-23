package com.turtlecoin.auctionservice.global.exception;

public class AuctionNotFoundException extends RuntimeException {
    public AuctionNotFoundException(String message) {
        super(message);
    }

    public AuctionNotFoundException(String message, Throwable cause){
        super(message, cause);
    }

    public AuctionNotFoundException(Throwable cause){
        super(cause);
    }

    public AuctionNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
