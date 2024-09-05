package com.turtlecoin.mainservice.domain.turtlephoto.entity;

import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import com.turtlecoin.mainservice.domain.user.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class TurtlePhoto extends BaseEntity {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "turtle_id", nullable = false)
    private Turtle turtle;

    @Column(nullable = false)
    private String image;
}
