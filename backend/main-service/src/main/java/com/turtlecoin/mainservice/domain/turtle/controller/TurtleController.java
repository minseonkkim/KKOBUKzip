package com.turtlecoin.mainservice.domain.turtle.controller;

import com.turtlecoin.mainservice.domain.turtle.dto.AuctionTurtleInfoDTO;
import com.turtlecoin.mainservice.domain.turtle.dto.TurtleResponseDTO;
import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import com.turtlecoin.mainservice.domain.turtle.service.TurtleService;
import com.turtlecoin.mainservice.global.exception.TurtleNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/main/turtle")
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

    @GetMapping("/{turtleId}")
    public TurtleResponseDTO getTurtleById (@PathVariable("turtleId") Long turtleId) {
        return turtleService.getTurtleById(turtleId);
    }

}
