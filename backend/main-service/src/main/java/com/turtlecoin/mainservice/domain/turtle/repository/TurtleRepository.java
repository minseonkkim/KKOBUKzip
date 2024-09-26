package com.turtlecoin.mainservice.domain.turtle.repository;

import java.util.Optional;

import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;

public interface TurtleRepository extends JpaRepository<Turtle, Long>, QuerydslPredicateExecutor<Turtle> {
	@Query("select t from Turtle t where t.uuid = :uuid")
	Optional<Turtle> findByUUID(@Param("uuid") String uuid);
}
