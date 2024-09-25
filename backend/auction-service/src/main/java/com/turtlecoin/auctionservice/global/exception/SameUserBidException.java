package com.turtlecoin.auctionservice.global.exception;

public class SameUserBidException extends RuntimeException {
  public SameUserBidException(String message) {
    super(message);
  }

  public SameUserBidException(String message, Throwable cause){
    super(message, cause);
  }

  public SameUserBidException(Throwable cause){
    super(cause);
  }

  public SameUserBidException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace){
    super(message, cause, enableSuppression, writableStackTrace);
  }
}
