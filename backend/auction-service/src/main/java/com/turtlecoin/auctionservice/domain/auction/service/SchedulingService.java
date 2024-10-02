package com.turtlecoin.auctionservice.domain.auction.service;

import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.domain.global.internal.SchedulingTask;
import lombok.RequiredArgsConstructor;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.function.Consumer;

@Service
public class SchedulingService {
    private final TaskScheduler taskScheduler;
    private final TransactionTemplate transactionTemplate;

    public SchedulingService(
            @Qualifier("taskScheduler") TaskScheduler taskScheduler,
            TransactionTemplate transactionTemplate) {
        this.taskScheduler = taskScheduler;
        this.transactionTemplate = transactionTemplate;
    }

    public <T> void scheduleTask(T target, Consumer<T> action, LocalDateTime executionTime) {
        SchedulingTask<T> task = new SchedulingTask<>(target, action, transactionTemplate);
        Instant executionDate = executionTime.atZone(ZoneId.systemDefault()).toInstant();

        taskScheduler.schedule(task, executionDate);
    }
}
