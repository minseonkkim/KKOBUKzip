package com.turtlecoin.mainservice.global.exception;

public class NotTransferDocumentException extends RuntimeException {
	public NotTransferDocumentException(){

	}

	public NotTransferDocumentException(String message){
		super(message);
	}

	public NotTransferDocumentException(String message, Throwable cause){
		super(message, cause);
	}

	public NotTransferDocumentException(Throwable cause){
		super(cause);
	}

	public NotTransferDocumentException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
		super(message, cause, enableSuppression, writableStackTrace);
	}
}
