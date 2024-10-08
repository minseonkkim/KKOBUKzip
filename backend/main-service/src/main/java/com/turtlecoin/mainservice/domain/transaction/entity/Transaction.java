package com.turtlecoin.mainservice.domain.transaction.entity;

import com.turtlecoin.mainservice.domain.transaction.dto.DetailTransactionResponseDto;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import com.turtlecoin.mainservice.domain.user.entity.User;
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
@Table(name = "transaction")
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
    private int weight;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionProgress progress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turtle_id")
    private Turtle turtle;

    @Column(name = "document_hash")
    private String documentHash;

    // 나중에 user에 넣을 수 있으면 넣기...
    @Column(name="seller_address")
    private String sellerAddress;

    @Column(name = "auction_flag")
    private Boolean auctionFlag;

    // 구매자 아이디 추가(조회를 위해서)
    @Column(name = "buyer_id", nullable = true)
    private Long buyerId;

    @Column(name="buyer_uuid", nullable = true)
    private String buyerUuid;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL)
    @Column(name = "transaction_photos")
    @Builder.Default
    private List<TransactionPhoto> transactionPhotos = new ArrayList<>();

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL)
    @Builder.Default
    private List<TransactionTag> tags = new ArrayList<>();


    @Transactional
    public void changeStatusToReviewDocument(Long id, String uuid) {
        this.buyerId = id;
        this.buyerUuid = uuid;
        this.progress = TransactionProgress.REVIEW_DOCUMENT;
    }

    @Transactional
    public void changeStatusToCompleteDocument() {
        this.progress = TransactionProgress.COMPLETED;
    }

    @Transactional
    public DetailTransactionResponseDto toResponseDTO() {

        return DetailTransactionResponseDto.builder()
                .transactionId(this.id)
                .buyerId(this.getBuyerId())
                .buyerUuid(this.getBuyerUuid())
                .sellerUuid(this.turtle.getUser().getUuid())
                .sellerId(this.turtle.getUser().getId()) // Seller ID
                .sellerName(this.turtle.getUser().getName()) // Seller Name
                .turtleId(this.turtle.getId()) // Turtle ID
                .scientificName(this.turtle.getScientificName()) // Scientific Name
                .price(this.price) // 가격
                .createDate(this.getCreateDate().toString()) // 생성일자 (BaseEntity에서 상속된 필드)
                .weight(this.getWeight()) // 거북이 무게
                .content(this.content) // 거래 내용
                .transactionTag(this.tags.stream()
                        .map(TransactionTag::getTag)
                        .collect(Collectors.toList())) // 태그 리스트
                .transactionImage(this.transactionPhotos.stream()
                        .map(TransactionPhoto::getImageAddress)
                        .collect(Collectors.toList())) // 이미지 경로 리스트
                .progress(this.progress.name()) // Enum 값 (거래 진행 상황)
                .sellerImageUrl(this.turtle.getUser().getProfileImage())
                .title(this.title)
                .sellerAddress(this.sellerAddress)
                .turtleUuid(this.turtle.getUuid())
                .documentHash(this.documentHash)
                .sellerNickname(this.getTurtle().getUser().getNickname())
                .build();
    }
}
