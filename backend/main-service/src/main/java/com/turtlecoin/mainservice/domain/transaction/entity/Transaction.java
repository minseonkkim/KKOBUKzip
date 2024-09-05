package com.turtlecoin.mainservice.domain.transaction.entity;

import com.turtlecoin.mainservice.domain.transactionphoto.entity.TransactionPhoto;
import com.turtlecoin.mainservice.domain.transactiontag.entity.TransactionTag;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import com.turtlecoin.mainservice.domain.user.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class Transaction extends BaseEntity {
    @Id @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String title;

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
