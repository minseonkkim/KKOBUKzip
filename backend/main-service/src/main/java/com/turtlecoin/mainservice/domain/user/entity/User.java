package com.turtlecoin.mainservice.domain.user.entity;

import com.turtlecoin.mainservice.global.entity.BaseEntity;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@AllArgsConstructor
@Table(name = "user")
@Builder
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

    @Column(nullable = false, name = "foreign_flag")
    private Boolean foreignFlag;

    @Column(nullable = false)
    private LocalDate birth;

    @Column(nullable = false)
    private String phonenumber;

    @Column(nullable = false)
    private String address;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(nullable = false)
    private String uuid;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role=Role.ROLE_USER;;

    @OneToMany(mappedBy = "user")
    private List<Turtle> turtles = new ArrayList<>();

    // 비밀번호 체크
    public void checkPassword(PasswordEncoder passwordEncoder, String password) {
        if (!passwordEncoder.matches(password, this.password)) {
            throw new IllegalArgumentException("Invalid password");
        }
    }

    @Transactional

    public void modifyProfileImage(String imageURL){
        this.profileImage = imageURL;
    }
    public User(String email, String password, String nickname, String name,
                Boolean foreignFlag, LocalDate birth, String phonenumber,
                String address, Role role, String profileImage, String uuid)  {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.name = name;
        this.foreignFlag = foreignFlag;
        this.birth = birth;
        this.phonenumber = phonenumber;
        this.address = address;
        this.role = role;
        this.profileImage = profileImage;
        this.uuid = uuid;

    }
}
