package com.turtlecoin.auctionservice.feign;

import com.turtlecoin.auctionservice.domain.turtle.entity.Gender;
import com.turtlecoin.auctionservice.feign.dto.TurtleResponseDTO;
import com.turtlecoin.auctionservice.feign.dto.UserResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "main-service")
public interface MainClient {
    @GetMapping("/api/turtle/filter")
    List<TurtleResponseDTO> getFilteredTurtles(
            @RequestParam(required = false)Gender gender,
            @RequestParam(required = false)Double minSize,
            @RequestParam(required = false)Double maxSize);

    @GetMapping("/api/main/turtle/{turtleId}")
    TurtleResponseDTO getTurtle(@PathVariable Long turtleId);

    @GetMapping("api/main/user/{userId}")
    UserResponseDTO getUserById(@PathVariable("userId") Long userId);
}
