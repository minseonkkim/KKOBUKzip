//package com.turtlecoin.mainservice.global.config;
//
//import org.springframework.amqp.core.Binding;
//import org.springframework.amqp.core.BindingBuilder;
//import org.springframework.amqp.core.DirectExchange;
//import org.springframework.amqp.core.Queue;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class RabbitConfig {
//    public static final String TURTLE_REQUEST_QUEUE = "turtleRequestQueue";
//    public static final String TURTLE_RESPONSE_QUEUE = "turtleResponseQueue";
//    public static final String EXCHANGE = "turtleExchange";
//    public static final String ROUTING_KEY = "turtle.routingKey";
//
//    // 요청 큐
//    @Bean
//    public Queue requestQueue() {
//        return new Queue(TURTLE_REQUEST_QUEUE);
//    }
//
//    // 응답 큐
//    @Bean
//    public Queue responseQueue() {
//        return new Queue(TURTLE_RESPONSE_QUEUE);
//    }
//
//    // 교환기 설정
//    @Bean
//    public DirectExchange exchange() {
//        return new DirectExchange(EXCHANGE);
//    }
//
//    // 요청 큐 바인딩
//    @Bean
//    public Binding requestBinding(Queue requestQueue, DirectExchange exchange) {
//        return BindingBuilder.bind(requestQueue).to(exchange).with(ROUTING_KEY);
//    }
//
//    // 응답 큐 바인딩
//    @Bean
//    public Binding responseBinding(Queue responseQueue, DirectExchange exchange) {
//        return BindingBuilder.bind(responseQueue).to(exchange).with(ROUTING_KEY);
//    }
//}
