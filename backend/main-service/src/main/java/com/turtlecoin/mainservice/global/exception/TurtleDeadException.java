package com.turtlecoin.mainservice.global.exception;

public class TurtleDeadException extends RuntimeException {
	public TurtleDeadException(){

	}

	public TurtleDeadException(String message){
		super(message);
	}

	public TurtleDeadException(String message, Throwable cause){
		super(message, cause);
	}

	public TurtleDeadException(Throwable cause){
		super(cause);
	}

	public TurtleDeadException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
		super(message, cause, enableSuppression, writableStackTrace);
	}
}
