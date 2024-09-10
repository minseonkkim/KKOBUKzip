package com.turtlecoin.mainservice.domain.user.service;

import com.turtlecoin.mainservice.domain.user.dto.UserRequestDto;
import com.turtlecoin.mainservice.domain.user.entity.Role;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public User saveUser(UserRequestDto dto) {
        Role role = (dto.getRole() == null) ? Role.ROLE_USER : dto.getRole();
        User user = new User(
                dto.getEmail(),
                dto.getPassword(),
                dto.getNickname(),
                dto.getName(),
                dto.getForeignFlag(),
                dto.getBirth(),
                dto.getPhonenumber(),
                dto.getAddress(),
                dto.getUuid(),
                role
        );
        return userRepository.save(user);
    }
}
