package com.turtlecoin.mainservice.domain.transaction.entity;

import com.turtlecoin.mainservice.domain.transaction.dto.DetailTransactionResponseDto;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import com.turtlecoin.mainservice.global.entity.BaseEntity;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double weight;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionProgress progress;

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


    @Transactional
    public void changeStatusToReviewDocument() {
        this.progress = TransactionProgress.REVIEW_DOCUMENT;
    }

    @Transactional
    public void changeStatusToCompleteDocument() {
        this.progress = TransactionProgress.COMPLETED;
    }

    public DetailTransactionResponseDto toResponseDTO() {
        return DetailTransactionResponseDto.builder()
                .transactionId(this.id)
                .sellerId(this.turtle.getUser().getId()) // Seller ID
                .sellerName(this.turtle.getUser().getName()) // Seller Name
                .turtleId(this.turtle.getId()) // Turtle ID
                .scientificName(this.turtle.getScientificName()) // Scientific Name
                .price(this.price) // 가격
                .createDate(this.getCreateDate().toString()) // 생성일자 (BaseEntity에서 상속된 필드)
                .weight(this.turtle.getWeight()) // 거북이 무게
                .content(this.content) // 거래 내용
                .transactionTag(this.tags.stream()
                        .map(TransactionTag::getTag)
                        .collect(Collectors.toList())) // 태그 리스트
                .transactionImage(this.transactionPhotos.stream()
                        .map(TransactionPhoto::getImageAddress)
                        .collect(Collectors.toList())) // 이미지 경로 리스트
                .progress(this.progress.name()) // Enum 값 (거래 진행 상황)
                .build();
    }
}
