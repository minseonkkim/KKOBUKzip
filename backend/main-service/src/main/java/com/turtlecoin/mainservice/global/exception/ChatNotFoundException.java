package com.turtlecoin.mainservice.global.exception;

public class ChatNotFoundException extends RuntimeException {
	public ChatNotFoundException(){

	}

	public ChatNotFoundException(String message){
		super(message);
	}

	public ChatNotFoundException(String message, Throwable cause){
		super(message, cause);
	}

	public ChatNotFoundException(Throwable cause){
		super(cause);
	}

	public ChatNotFoundException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
		super(message, cause, enableSuppression, writableStackTrace);
	}
}
