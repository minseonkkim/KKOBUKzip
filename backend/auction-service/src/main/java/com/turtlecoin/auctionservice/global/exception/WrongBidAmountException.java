package com.turtlecoin.auctionservice.global.exception;

public class WrongBidAmountException extends RuntimeException {
    public WrongBidAmountException(){
    }

    public WrongBidAmountException(String message){
        super(message);
    }

    public WrongBidAmountException(String message, Throwable cause){
        super(message, cause);
    }

    public WrongBidAmountException(Throwable cause){
        super(cause);
    }

    public WrongBidAmountException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
