package com.turtlecoin.mainservice.global.exception;

public class DocumentProgressException extends RuntimeException {
	public DocumentProgressException(){

	}

	public DocumentProgressException(String message){
		super(message);
	}

	public DocumentProgressException(String message, Throwable cause){
		super(message, cause);
	}

	public DocumentProgressException(Throwable cause){
		super(cause);
	}

	public DocumentProgressException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
		super(message, cause, enableSuppression, writableStackTrace);
	}
}
