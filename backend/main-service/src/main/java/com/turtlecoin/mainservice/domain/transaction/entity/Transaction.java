package com.turtlecoin.mainservice.domain.transaction.entity;

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
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turtle_id")
    private Turtle turtle;

    @Column(name = "document_hash")
    private String documentHash;

    @OneToMany(mappedBy = "transaction")
    @Column(name = "transaction_photos")
    private List<TransactionPhoto> transactionPhotos = new ArrayList<>();

    @OneToMany(mappedBy = "transaction")
    private List<TransactionTag> tags = new ArrayList<>();
}
