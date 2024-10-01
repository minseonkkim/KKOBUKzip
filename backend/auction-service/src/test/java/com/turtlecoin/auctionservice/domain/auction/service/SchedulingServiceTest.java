package com.turtlecoin.auctionservice.domain.auction.service;

import jakarta.persistence.EntityManagerFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import javax.sql.DataSource;
import java.time.LocalDateTime;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SchedulingServiceTest {
    @MockBean
    private DataSource dataSource;

    @MockBean
    private EntityManagerFactory entityManagerFactory;
    @Autowired
    private SchedulingService schedulingService;

    String target = "Hello";
    Consumer<String> action = message -> System.out.println("Executing task with message: " + message);

    @Test
    public void testScheduling(){
        schedulingService.scheduleTask(target, action, LocalDateTime.now().plusSeconds(10));
    }
}