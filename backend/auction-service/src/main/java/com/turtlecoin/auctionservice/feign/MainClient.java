package com.turtlecoin.auctionservice.feign;

import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import com.turtlecoin.auctionservice.feign.dto.TurtleResponseDTO;
import com.turtlecoin.auctionservice.feign.dto.UserResponseDTO;
import com.turtlecoin.auctionservice.global.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "main-service", configuration = FeignConfig.class)
public interface MainClient {
    @GetMapping("/main/turtle/filter")
    List<TurtleResponseDTO> getFilteredTurtles(
            @RequestParam(required = false)Gender gender,
            @RequestParam(required = false)Double minSize,
            @RequestParam(required = false)Double maxSize);

    @GetMapping("/main/user/{userId}/turtle")
    List<TurtleResponseDTO> getTurtlesByUserId(@PathVariable("userId") Long userId);

    @GetMapping("/main/turtle/{turtleId}")
    TurtleResponseDTO getTurtle(@PathVariable Long turtleId);

    @GetMapping("/main/user/{userId}")
    UserResponseDTO getUserById(@PathVariable("userId") Long userId);
}
