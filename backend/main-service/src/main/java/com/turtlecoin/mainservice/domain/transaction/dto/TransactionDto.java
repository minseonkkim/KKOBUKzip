package com.turtlecoin.mainservice.domain.transaction.dto;

import com.turtlecoin.mainservice.domain.transaction.entity.*;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import com.turtlecoin.mainservice.domain.user.entity.User;
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
    private String documentHash;
    private double price;
    // Double int로 변경
    private int weight;
    private Turtle turtle;
    private TransactionProgress progress;
    private List<TransactionTag> transactionTags;
    private List<TransactionPhoto> transactionPhotos;

    @Transactional
    public Transaction toEntity() {
        return Transaction.builder()
                .auctionFlag(false)
                .title(title)
                .content(content)
                .price(price)
                .weight(weight)
                .turtle(turtle)
                .documentHash(documentHash)
                .sellerAddress(sellerAddress)
                .progress(TransactionProgress.SAIL)
                .transactionPhotos(transactionPhotos) // 이름 일치
                .tags(transactionTags)
                .build();
    }

}
