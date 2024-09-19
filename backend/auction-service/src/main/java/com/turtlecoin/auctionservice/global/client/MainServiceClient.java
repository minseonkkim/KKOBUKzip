package com.turtlecoin.auctionservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "main-service")
public interface MainServiceClient {

}
