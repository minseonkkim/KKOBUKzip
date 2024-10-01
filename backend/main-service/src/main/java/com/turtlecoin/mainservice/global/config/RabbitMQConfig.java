package com.turtlecoin.mainservice.global.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class RabbitMQConfig {

    @Value("${spring.rabbitmq.host}")
    private String host;

    @Value("${spring.rabbitmq.username}")
    private String username;

    @Value("${spring.rabbitmq.password}")
    private String password;

    @Value("${spring.rabbitmq.port}")
    private int port;

    // 1. Direct Exchange 설정
    @Bean
    DirectExchange auctionResultExchange() {
        return new DirectExchange("auction.result.exchange");
    }

    // 2. Queue 설정
    @Bean
    Queue auctionResultQueue() {
        return new Queue("auction.result.queue", true);  // durable true로 설정
    }

    // 3. Exchange와 Queue 바인딩 (Routing Key 사용)
    @Bean
    Binding auctionResultBinding(DirectExchange auctionResultExchange, Queue auctionResultQueue) {
        return BindingBuilder.bind(auctionResultQueue).to(auctionResultExchange).with("auction.result.key");
    }

    // 4. 메시지 전송/수신을 위한 JSON 메시지 컨버터 설정
    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // 5. RabbitTemplate 설정
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }


    // 6. ConnectionFactory 설정
    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory();
        connectionFactory.setHost(host);
        connectionFactory.setPort(port);
        connectionFactory.setUsername(username);
        connectionFactory.setPassword(password);
        return connectionFactory;
    }
}