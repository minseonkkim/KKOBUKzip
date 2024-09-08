package com.turtlecoin.auctionservice.global.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String TURTLE_REQUEST_QUEUE = "turtleRequestQueue";
    public static final String TURTLE_RESPONSE_QUEUE = "turtleResponseQueue";
    public static final String EXCHANGE = "turtleExchange";
    public static final String ROUTING_KEY = "turtle.routingKey";

    @Bean
    public Queue requestQueue() {
        return new Queue(TURTLE_REQUEST_QUEUE);
    }

    @Bean
    public Queue responseQueue() {
        return new Queue(TURTLE_RESPONSE_QUEUE);
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    public Binding requestBinding(Queue requestQueue, DirectExchange exchange) {
        return BindingBuilder.bind(requestQueue).to(exchange).with(ROUTING_KEY);
    }

    @Bean
    public Binding responseBinding(Queue responseQueue, DirectExchange exchange) {
        return BindingBuilder.bind(responseQueue).to(exchange).with(ROUTING_KEY);
    }
}

