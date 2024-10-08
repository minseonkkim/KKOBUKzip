package com.turtlecoin.mainservice.global.exception;

public class SelfChatRoomCreationException extends RuntimeException {
	public SelfChatRoomCreationException(){

	}

	public SelfChatRoomCreationException(String message){
		super(message);
	}

	public SelfChatRoomCreationException(String message, Throwable cause){
		super(message, cause);
	}

	public SelfChatRoomCreationException(Throwable cause){
		super(cause);
	}

	public SelfChatRoomCreationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
		super(message, cause, enableSuppression, writableStackTrace);
	}
}
