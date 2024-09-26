package com.turtlecoin.mainservice.domain.transaction.dto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TransactionRequestDto {
    private String title;
    private String content;
    private double price;
    private double weight;
    private Long turtle_id;
    private List<String> transactionTags;
}
