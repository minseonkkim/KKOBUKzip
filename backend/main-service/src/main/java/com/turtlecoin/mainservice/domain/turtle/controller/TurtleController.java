package com.turtlecoin.mainservice.domain.turtle.controller;

import com.turtlecoin.mainservice.domain.turtle.dto.AuctionTurtleInfoDTO;
import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import com.turtlecoin.mainservice.domain.turtle.service.TurtleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/main/turtle")
public class TurtleController {
    private final TurtleService turtleService;

    @GetMapping("/filter")
    public List<AuctionTurtleInfoDTO> getFilteredTurtles(
            @RequestParam(required = false)Gender gender,
            @RequestParam(required = false)Double minSize,
            @RequestParam(required = false)Double maxSize
            ) {
        return turtleService.getFilteredTurtles(gender, minSize, maxSize);
    }
}
