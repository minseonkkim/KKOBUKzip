package com.turtlecoin.auctionservice.global.exception;

public class PhotoNotUploadedException extends RuntimeException {
  public PhotoNotUploadedException(String message) {
    super(message);
  }

  public PhotoNotUploadedException(String message, Throwable cause){
    super(message, cause);
  }

  public PhotoNotUploadedException(Throwable cause){
    super(cause);
  }

  public PhotoNotUploadedException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
    super(message, cause, enableSuppression, writableStackTrace);
  }
}
