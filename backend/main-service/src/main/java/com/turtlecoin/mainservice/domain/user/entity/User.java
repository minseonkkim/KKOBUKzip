package com.turtlecoin.mainservice.domain.user.entity;

import com.turtlecoin.mainservice.domain.global.entity.BaseEntity;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class User extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Boolean foreignFlag;

    @Column(nullable = false)
    private LocalDate birth;

    @Column(nullable = false)
    private String phonenumber;

    @Column(nullable = false)
    private String address;

    private String profileImage;

    @Column(nullable = false)
    private String uuid;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user")
    private List<Turtle> turtles = new ArrayList<>();

    // 비밀번호 체크
    public void checkPassword(PasswordEncoder passwordEncoder, String password) {
        if (!passwordEncoder.matches(password, this.password)) {
            throw new IllegalArgumentException("Invalid password");
        }
    }
}
