package com.turtlecoin.mainservice.domain.turtle.repository;

import com.turtlecoin.mainservice.domain.turtle.entity.TurtlePhoto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TurtlePhotoRepository extends JpaRepository<TurtlePhoto, Long> {
}
