package com.turtlecoin.auctionservice.domain.turtle.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class TurtleRequestSender {
    private final RabbitTemplate rabbitTemplate;

    public TurtleRequestSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendTurtleRequest(Long turtleId) {
        rabbitTemplate.convertAndSend("turtleRequestQueue", turtleId);
    }
}
