package com.turtlecoin.mainservice.domain.user.controller;

import com.turtlecoin.mainservice.domain.user.dto.EmailDto;
import com.turtlecoin.mainservice.domain.user.dto.UserRequestDto;
import com.turtlecoin.mainservice.domain.user.service.EmailService;
import com.turtlecoin.mainservice.domain.user.service.JoinService;
import com.turtlecoin.mainservice.global.response.ResponseVO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/user")
@Controller
@ResponseBody
public class UserController {

    private final JoinService joinService;
    private final EmailService emailService;
    public UserController(JoinService joinService, EmailService emailService) {
        this.joinService = joinService;
        this.emailService = emailService;
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

    @PostMapping("/email/request")
    public ResponseEntity<?> emailRequest(@RequestParam String email) {
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
}
