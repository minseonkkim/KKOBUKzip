package com.turtlecoin.mainservice.domain.transaction.dto;

import com.turtlecoin.mainservice.domain.transaction.entity.*;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import com.turtlecoin.mainservice.global.entity.BaseEntity;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Transactional
public class TransactionDto extends BaseEntity {
    private String title;
    private String content;
    private String sellerAddress;
    private double price;
    private double weight;
    private Turtle turtle;
    private TransactionProgress progress;
    private List<TransactionTag> transactionTags;
    private List<TransactionPhoto> transactionPhotos;

    @Transactional
    public Transaction toEntity() {
        return Transaction.builder()
                .title(title)
                .content(content)
                .price(price)
                .weight(weight)
                .turtle(turtle)
                .sellerAddress(sellerAddress)
                .progress(TransactionProgress.SAIL)
                .transactionPhotos(transactionPhotos) // 이름 일치
                .tags(transactionTags)
                .build();
    }

}
