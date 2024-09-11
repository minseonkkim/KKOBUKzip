package com.turtlecoin.mainservice.domain.turtle.repository;

import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TurtleRepository extends JpaRepository<Turtle, Long> {
}
