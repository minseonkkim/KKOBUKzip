package com.turtlecoin.mainservice.domain.user.dto;

import com.turtlecoin.mainservice.domain.user.entity.Role;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

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
    private MultipartFile profileImage;
    private Role role;

    public Role getRole() {
        return role == null ? Role.ROLE_USER : role;
    }
}
