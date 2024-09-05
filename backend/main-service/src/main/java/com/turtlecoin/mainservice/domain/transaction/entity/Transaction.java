package com.turtlecoin.mainservice.domain.transaction.entity;

import com.turtlecoin.mainservice.domain.transactionphoto.entity.TransactionPhoto;
import com.turtlecoin.mainservice.domain.transactiontag.entity.TransactionTag;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import com.turtlecoin.mainservice.domain.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Transaction extends BaseEntity {
    @Id @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionProgress progress;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @OneToOne(mappedBy = "transaction", fetch = FetchType.LAZY)
    private Turtle turtle;

    private String documentHash;

    @OneToMany(mappedBy = "transaction")
    private List<TransactionPhoto> transactionPhotos = new ArrayList<>();

    @OneToMany(mappedBy = "transaction")
    private List<TransactionTag> tags = new ArrayList<>();
}
