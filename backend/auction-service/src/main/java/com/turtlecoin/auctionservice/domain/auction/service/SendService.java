package com.turtlecoin.auctionservice.domain.auction.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SendService {
    private final RabbitTemplate rabbitTemplate;

    @Value("${spring.rabbitmq.exchange}")
    private String auctionResultExchange;

    @Value("${spring.rabbitmq.routingKey}")
    private String auctionResultRoutingKey;

    public void sendAuctionResult (Object auctionResult) {
        rabbitTemplate.convertAndSend(auctionResultExchange, auctionResultRoutingKey, auctionResult);
    }
}
