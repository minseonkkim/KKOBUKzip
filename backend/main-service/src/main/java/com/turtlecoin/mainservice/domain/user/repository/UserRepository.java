package com.turtlecoin.mainservice.domain.user.repository;


import java.util.Optional;

import com.turtlecoin.mainservice.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
    Boolean existsByname(String name);
    User findByname(String name);
    User findByemail(String email);
    @Query("select u from User u where u.uuid = :uuid")
    Optional<User> findUserByUUID(@Param("uuid") String uuid);
    @Query("select u from User u where u.name = :name and u.phonenumber = :phonenumber")
    Optional<User> findUserByNameAndPhoneNumber(@Param("name") String name, @Param("phonenumber") String phonenumber);
}
