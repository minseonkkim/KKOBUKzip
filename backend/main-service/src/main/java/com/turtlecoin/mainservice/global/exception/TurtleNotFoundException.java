package com.turtlecoin.mainservice.global.exception;

public class TurtleNotFoundException extends RuntimeException{
    public TurtleNotFoundException(){

    }

    public TurtleNotFoundException(String message){
        super(message);
    }

    public TurtleNotFoundException(String message, Throwable cause){
        super(message, cause);
    }

    public TurtleNotFoundException(Throwable cause){
        super(cause);
    }

    public TurtleNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
