package com.turtlecoin.auctionservice.global.exception;

public class TurtleAlreadyRegisteredException extends RuntimeException {
    public TurtleAlreadyRegisteredException(String message) {
        super(message);
    }

    public TurtleAlreadyRegisteredException(String message, Throwable cause){
        super(message, cause);
    }

    public TurtleAlreadyRegisteredException(Throwable cause){
        super(cause);
    }

    public TurtleAlreadyRegisteredException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
