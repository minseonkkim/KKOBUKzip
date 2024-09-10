package com.turtlecoin.mainservice.domain.user.dto;

import com.turtlecoin.mainservice.domain.user.entity.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserRequestDto {
    private String email;
    private String password;
    private String nickname;
    private String name;
    private Boolean foreignFlag;
    private LocalDate birth;
    private String phonenumber;
    private String address;
    private String profileImage;
    private Role role;

    public Role getRole() {
        return role == null ? Role.ROLE_USER : role;
    }
}
