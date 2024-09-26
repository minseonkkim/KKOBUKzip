package com.turtlecoin.mainservice.domain.transaction.dto;

import com.turtlecoin.mainservice.domain.transaction.entity.*;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TransactionDto {
    private String title;
    private String content;
    private TransactionProgress progress;
    private double price;
    private double weight;
    private Turtle turtle;
    private List<TransactionTag> transactionTags;
    private List<TransactionPhoto> transactionPhotos;
    public Transaction toEntity() {
        return Transaction.builder()
                .title(title)
                .content(content)
                .price(price)
                .weight(weight)
                .turtle(turtle)
                .progress(TransactionProgress.SAIL)
                .transactionPhotos(transactionPhotos) // 이름 일치
                .tags(transactionTags)
                .build();
    }

}
