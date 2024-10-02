package com.turtlecoin.auctionservice.domain.global.internal;

import lombok.AllArgsConstructor;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.function.Consumer;

@AllArgsConstructor
public class SchedulingTask<T> implements Runnable {
    // target은 입력값 역할을 함
    // 우리 프로젝트에서는 auctionID를 받아오는 것이 될듯
    private final T target;
    // 실제 수행할 함수
    private final Consumer<T> task;

    private final TransactionTemplate transactionTemplate;

    @Override
    public void run() {
        task.accept(target);
        // transactionTemplate.execute(status -> {
        //     return null;
        // });
    }
}
