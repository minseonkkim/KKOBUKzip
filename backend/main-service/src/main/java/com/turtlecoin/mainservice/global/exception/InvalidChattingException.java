package com.turtlecoin.mainservice.global.exception;

public class InvalidChattingException extends RuntimeException {
	public InvalidChattingException(){

	}

	public InvalidChattingException(String message){
		super(message);
	}

	public InvalidChattingException(String message, Throwable cause){
		super(message, cause);
	}

	public InvalidChattingException(Throwable cause){
		super(cause);
	}

	public InvalidChattingException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
		super(message, cause, enableSuppression, writableStackTrace);
	}
}
