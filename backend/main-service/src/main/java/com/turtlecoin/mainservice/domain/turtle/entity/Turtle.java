package com.turtlecoin.mainservice.domain.turtle.entity;

import com.turtlecoin.mainservice.domain.transaction.entity.Transaction;
import com.turtlecoin.mainservice.domain.global.entity.BaseEntity;
import com.turtlecoin.mainservice.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Turtle extends BaseEntity {
    @Id @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String scientificName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false)
    private Double weight;

    @Column(nullable = false)
    private LocalDate birth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dad_id")
    private Turtle dad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mom_id")
    private Turtle mom;

    private String name;

    @Column(nullable = false)
    private UUID uuid;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Transaction transaction;

    @OneToMany(mappedBy = "turtle", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TurtlePhoto> turtlePhotos = new ArrayList<>();
}
