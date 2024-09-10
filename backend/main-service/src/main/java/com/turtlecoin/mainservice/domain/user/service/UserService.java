package com.turtlecoin.mainservice.domain.user.service;

import com.turtlecoin.mainservice.domain.user.dto.UserRequestDto;
import com.turtlecoin.mainservice.domain.user.entity.Role;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public User saveUser(UserRequestDto dto) {
        Role role = (dto.getRole() == null) ? Role.ROLE_USER : dto.getRole();
        String uuid = String.valueOf(new SecretKeySpec(dto.getEmail().getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm()));
        User user = new User(
                dto.getEmail(),
                dto.getPassword(),
                dto.getNickname(),
                dto.getName(),
                dto.getForeignFlag(),
                dto.getBirth(),
                dto.getPhonenumber(),
                dto.getAddress(),
                role,
                dto.getProfileImage(),
                uuid
        );
        return userRepository.save(user);
    }
}
