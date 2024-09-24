package com.turtlecoin.mainservice.domain.user.controller;

import com.turtlecoin.mainservice.domain.turtle.dto.TurtleResponseDTO;
import com.turtlecoin.mainservice.domain.user.dto.EmailDto;
import com.turtlecoin.mainservice.domain.user.dto.LoginUserDto;
import com.turtlecoin.mainservice.domain.user.dto.UserRequestDto;
import com.turtlecoin.mainservice.domain.user.dto.UserResponseDTO;
import com.turtlecoin.mainservice.domain.user.service.EmailService;
import com.turtlecoin.mainservice.domain.user.service.JWTService;
import com.turtlecoin.mainservice.domain.user.service.JoinService;
import com.turtlecoin.mainservice.domain.user.service.UserService;
import com.turtlecoin.mainservice.global.response.ResponseVO;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RequestMapping("/main/user")
@Controller
@ResponseBody
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    private final JoinService joinService;
    private final EmailService emailService;
    private final UserService userService;;
    private final JWTService jwtService;

    public UserController(JoinService joinService, EmailService emailService, UserService userService, JWTService jwtService ) {
        this.joinService = joinService;
        this.emailService = emailService;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/join")
    public ResponseEntity<ResponseVO<?>> joinProcess(@RequestBody UserRequestDto userDto) {
        ResponseVO<?> responseVO = joinService.joinProcess(userDto);

        if ("200".equals(responseVO.getStatus())) {
            return ResponseEntity.ok(responseVO);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseVO);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginUserDto loginUserDto) {
        return jwtService.loginService(loginUserDto);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String token = request.getHeader("Refresh-Token");
        return jwtService.logoutService(token);
    }

    @PostMapping("/email/request/{email}")
    public ResponseEntity<?> emailRequest(@PathVariable String email) {
        try {
            ResponseVO<?> responseVO = emailService.sendCodeToEmail(email);

            if ("200".equals(responseVO.getStatus())) {
                return ResponseEntity.ok(responseVO);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseVO);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("400", "올바른 요청이 아닙니다."));
        }
    }

    @PostMapping("/email")
    public ResponseEntity<?> verifyEmail(@RequestBody EmailDto emailDto) {
        try {
            ResponseVO<?> responseVO = emailService.verifyCode(emailDto);
            if ("200".equals(responseVO.getStatus())) {
                return ResponseEntity.ok(responseVO);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseVO);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ResponseVO.failure("400", "인증 과정에서 오류가 발생하였습니다."));
        }
    }

    @GetMapping("/{userId}")
    // 유저 없을 때 에러 던져주기
    public UserResponseDTO getUserById(@PathVariable Long userId) {
        return userService.getByUserId(userId);
    }

    @GetMapping("/{userId}/turtle")
    public ResponseEntity<List<TurtleResponseDTO>> getTurtlesByUserId(@PathVariable Long userId) {
        // 유저 없을 때 에러 던져주기

        // 사용자가 소유한 거북이 정보를 조회하는 로직
        List<TurtleResponseDTO> turtles = userService.getTurtlesByUserId(userId);
        log.info("거북이 정보: {}", turtles);
        if (turtles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(turtles);
    }

}
