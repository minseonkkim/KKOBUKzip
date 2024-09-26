package com.turtlecoin.mainservice.domain.transaction.entity;

import com.turtlecoin.mainservice.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "transaction_tag")
public class TransactionTag extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tag;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    public TransactionTag(String tag, Transaction transaction) {
        this.tag = tag;
        this.transaction = transaction;
    }
}
