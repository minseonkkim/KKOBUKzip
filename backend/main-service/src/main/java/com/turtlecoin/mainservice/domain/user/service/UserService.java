package com.turtlecoin.mainservice.domain.user.service;

import com.turtlecoin.mainservice.domain.turtle.dto.TurtleResponseDTO;
import com.turtlecoin.mainservice.domain.user.dto.UserRequestDto;
import com.turtlecoin.mainservice.domain.user.dto.UserResponseDTO;
import com.turtlecoin.mainservice.domain.user.entity.Role;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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

    public UserResponseDTO getByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return UserResponseDTO.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .name(user.getName())
                .build();
    }

    public List<TurtleResponseDTO> getTurtlesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return user.getTurtles().stream()
                .map(turtle -> TurtleResponseDTO.builder()
                        .id(turtle.getId())
                        .userId(userId)
                        .weight(turtle.getWeight())
                        .gender(turtle.getGender())
                        .build())
                .toList();
    }
}
