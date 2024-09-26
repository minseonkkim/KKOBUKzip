package com.turtlecoin.auctionservice.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
    @Value("${spring.data.redis.host}")
    private String host;
    @Value("${spring.data.redis.port}")
    private int port;
    @Value("${spring.data.redis.password}")
    private String password;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration redisConfiguration = new RedisStandaloneConfiguration();
        redisConfiguration.setHostName(host);
        redisConfiguration.setPort(port);
        redisConfiguration.setPassword(password);
        return new LettuceConnectionFactory(redisConfiguration);
    }
    // @Bean
    // public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
    //     RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();
    //     redisTemplate.setConnectionFactory(connectionFactory);
    //
    //     // Key와 Value의 직렬화 방식 설정
    //     redisTemplate.setKeySerializer(new StringRedisSerializer());
    //     redisTemplate.setValueSerializer(new StringRedisSerializer());
    //     redisTemplate.setHashKeySerializer(new StringRedisSerializer());
    //     redisTemplate.setHashValueSerializer(new StringRedisSerializer());
    //
    //     return redisTemplate;
    // }
    //
    // @Bean
    // public LettuceConnectionFactory lettuceConnectionFactory() {
    //     return new LettuceConnectionFactory();
    // }

    @Bean
    RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        return template;
    }
}
