package com.turtlecoin.mainservice.domain.user.repository;


import com.turtlecoin.mainservice.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    Boolean existsByusername(String username);
    User findByusername(String username);
}
