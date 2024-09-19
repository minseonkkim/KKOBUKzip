package com.turtlecoin.auctionservice.global.client;

import com.turtlecoin.auctionservice.domain.turtle.dto.AuctionTurtleInfoDTO;
import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "main-service")
public interface TurtleClient {
    @GetMapping("/api/turtle/filter")
    List<AuctionTurtleInfoDTO> getFilteredTurtles(
            @RequestParam(required = false)Gender gender,
            @RequestParam(required = false)Double minSize,
            @RequestParam(required = false)Double maxSize);
}
