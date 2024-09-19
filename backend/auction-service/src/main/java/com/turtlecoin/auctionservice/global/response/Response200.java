package com.turtlecoin.auctionservice.global.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Response200 {
    private String status;
    private String message;
    public Response200() {
        status = "200";
        message = "요청이 정상적으로 처리되었습니다.";
    }
}
