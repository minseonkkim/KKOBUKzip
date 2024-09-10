package com.turtlecoin.mainservice.domain.user.service;

import com.turtlecoin.mainservice.domain.user.dto.UserRequestDto;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class JoinService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, UserService userService) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userService = userService;
    }
    public ResponseEntity<?> joinProcess(UserRequestDto userDto){
        userDto.setPassword(bCryptPasswordEncoder.encode(userDto.getPassword()));
        User user = userService.saveUser(userDto);
        Map<String,Object> responseBody = new HashMap<>();
        try{
            User tmp = userRepository.save(user);
            responseBody.put("status", "200");
            responseBody.put("message", "요청이 정상적으로 수행되었습니다");
            return ResponseEntity.ok(responseBody);
        }catch(Exception e){
            responseBody.put("status", "400");
            responseBody.put("message","가입 중 에러가 발생하였습니다.");
            return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
        }
    }
    public Boolean verifyPassword(UserRequestDto userDto){
        String password = userDto.getPassword();
        // 특수 문자를 포함하고 있으며 8자 이상
        String regex = "^(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$";

        // 정규식 패턴과 입력 비밀번호를 매칭
        Pattern pattern = Pattern.compile(regex);
        return pattern.matcher(password).matches();
    }
}
