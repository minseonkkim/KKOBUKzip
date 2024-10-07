package com.turtlecoin.mainservice.domain.turtle.controller;

import com.turtlecoin.mainservice.domain.turtle.dto.AuctionTurtleInfoDTO;
import com.turtlecoin.mainservice.domain.turtle.dto.TurtleResponseDTO;
import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import com.turtlecoin.mainservice.domain.turtle.service.TurtleService;
import com.turtlecoin.mainservice.global.exception.TurtleNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
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
        log.info("파라미터 체크 성별: {}, 최소 사이즈 : {}, 최대 사이즈: {}", gender, minSize, maxSize);
        return turtleService.getFilteredTurtles(gender, minSize, maxSize);
    }

    @GetMapping("/{turtleId}")
    public TurtleResponseDTO getTurtleById (@PathVariable("turtleId") Long turtleId) {
        log.info("거북이 아이디로 조회 시도");
        return turtleService.getTurtleById(turtleId);
    }

}
