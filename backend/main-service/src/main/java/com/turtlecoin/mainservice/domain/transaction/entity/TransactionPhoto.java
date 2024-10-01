package com.turtlecoin.mainservice.domain.transaction.entity;

import com.turtlecoin.mainservice.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "transaction_photo")
public class TransactionPhoto extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "image_address")
    private String imageAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    public TransactionPhoto(String imageAddress, Transaction transaction) {
        this.imageAddress = imageAddress;
        this.transaction = transaction;
    }

    public TransactionPhoto(String imageAddress) {
        this.imageAddress = imageAddress;
    }

    @Override
    public String toString() {
        return "TransactionPhoto{" +
                "id=" + id +
                ", imageAddress='" + imageAddress + '\'' +
                ", transaction=" + transaction +
                '}';
    }
}
