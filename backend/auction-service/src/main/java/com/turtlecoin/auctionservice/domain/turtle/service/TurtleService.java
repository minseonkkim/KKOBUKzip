package com.turtlecoin.auctionservice.domain.turtle.service;

import com.turtlecoin.auctionservice.domain.turtle.dto.TurtleRequestDTO;
import com.turtlecoin.auctionservice.domain.turtle.dto.TurtleResponseDTO;
import com.turtlecoin.auctionservice.global.exception.TurtleNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

@Service
@RequiredArgsConstructor
public class TurtleService {

    private final RabbitTemplate rabbitTemplate;
    private static final String TURTLE_REQUEST_QUEUE = "turtleRequestQueue";
    private static final String TURTLE_RESPONSE_QUEUE = "turtleResponseQueue";

    public TurtleResponseDTO getTurtleInfo(Long turtleId) {
        TurtleRequestDTO request = new TurtleRequestDTO(turtleId);

        rabbitTemplate.convertAndSend(TURTLE_REQUEST_QUEUE, request);

        TurtleResponseDTO response = (TurtleResponseDTO) rabbitTemplate.receiveAndConvert(TURTLE_RESPONSE_QUEUE);

        if (response == null) {
            throw new TurtleNotFoundException("main-server에서 거북이의 응답 정보를 가져오지 못했습니다.");
        }

        return response;
    }
}
