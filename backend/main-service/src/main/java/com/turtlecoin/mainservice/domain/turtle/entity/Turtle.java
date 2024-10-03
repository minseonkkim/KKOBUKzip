package com.turtlecoin.mainservice.domain.turtle.entity;

import com.turtlecoin.mainservice.domain.transaction.entity.Transaction;
import com.turtlecoin.mainservice.global.entity.BaseEntity;
import com.turtlecoin.mainservice.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "turtle")
public class Turtle extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "scientific_name")
    private String scientificName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false)
    private int weight;

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
    private String uuid;

    @Column(nullable = false)
    private boolean dead;

    @OneToMany(mappedBy = "turtle", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transaction;

    @OneToMany(mappedBy = "turtle", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @Column(name = "turtle_photos")
    @Builder.Default
    private List<TurtlePhoto> turtlePhotos = new ArrayList<>();

    public void turtleDie(){
        this.dead = true;
    }

    public void turtleTransfer(User user){
        this.user = user;
    }
}



