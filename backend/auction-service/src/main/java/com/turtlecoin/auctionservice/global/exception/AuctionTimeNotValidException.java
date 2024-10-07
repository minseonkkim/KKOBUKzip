package com.turtlecoin.auctionservice.global.exception;

public class AuctionTimeNotValidException extends RuntimeException {
    public AuctionTimeNotValidException(String message) {
        super(message);
    }

    public AuctionTimeNotValidException(String message, Throwable cause){
        super(message, cause);
    }

    public AuctionTimeNotValidException(Throwable cause){
        super(cause);
    }

    public AuctionTimeNotValidException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
