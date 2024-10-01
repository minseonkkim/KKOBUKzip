package com.turtlecoin.auctionservice.global.exception;

public class AuctionAlreadyFinishedException extends RuntimeException {
    public AuctionAlreadyFinishedException(String message) {
        super(message);
    }

    public AuctionAlreadyFinishedException(String message, Throwable cause){
        super(message, cause);
    }

    public AuctionAlreadyFinishedException(Throwable cause){
        super(cause);
    }

    public AuctionAlreadyFinishedException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
