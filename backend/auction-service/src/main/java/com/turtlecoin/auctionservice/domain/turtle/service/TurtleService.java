package com.turtlecoin.auctionservice.domain.turtle.service;

import com.turtlecoin.auctionservice.domain.turtle.dto.TurtleRequest;
import com.turtlecoin.auctionservice.domain.turtle.dto.TurtleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TurtleService {

    private final RabbitTemplate rabbitTemplate;
    private static final String TURTLE_REQUEST_QUEUE = "turtleRequestQueue";
    private static final String TURTLE_RESPONSE_QUEUE = "turtleResponseQueue";

    public TurtleResponse getTurtleInfo(Long turtleId) {
        TurtleRequest request = new TurtleRequest(turtleId);

        rabbitTemplate.convertAndSend(TURTLE_REQUEST_QUEUE, request);

        return (TurtleResponse) rabbitTemplate.receiveAndConvert(TURTLE_RESPONSE_QUEUE);
    }
}
