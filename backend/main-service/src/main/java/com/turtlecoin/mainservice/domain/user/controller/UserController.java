package com.turtlecoin.mainservice.domain.user.controller;

import com.turtlecoin.mainservice.domain.transaction.service.TransactionService;
import com.turtlecoin.mainservice.domain.turtle.dto.TurtleResponseDTO;
import com.turtlecoin.mainservice.domain.user.dto.EmailDto;
import com.turtlecoin.mainservice.domain.user.dto.LoginUserDto;
import com.turtlecoin.mainservice.domain.user.dto.UserRequestDto;
import com.turtlecoin.mainservice.domain.user.dto.UserResponseDTO;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.repository.UserRepository;
import com.turtlecoin.mainservice.domain.user.service.EmailService;
import com.turtlecoin.mainservice.domain.user.service.JWTService;
import com.turtlecoin.mainservice.domain.user.service.UserService;
import com.turtlecoin.mainservice.domain.user.exception.UserNotFoundException;
import com.turtlecoin.mainservice.global.response.ResponseVO;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RequestMapping("/main/user")
@Controller
@ResponseBody
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    private final EmailService emailService;
    private final UserService userService;;
    private final JWTService jwtService;
    private final TransactionService transactionService;
    private final UserRepository userRepository;


    public UserController(EmailService emailService, UserService userService, JWTService jwtService, TransactionService transactionService, UserRepository userRepository) {
        this.emailService = emailService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.transactionService = transactionService;
        this.userRepository = userRepository;
    }

    @PostMapping(value="/join",consumes={MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ResponseVO<?>> joinProcess(
            @RequestPart("data") UserRequestDto userDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile image) {
        return userService.saveUser(userDto,image);
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

    @GetMapping("/")
    // 유저 없을 때 에러 던져주기
    public UserResponseDTO getUserById(@RequestHeader("Authorization") String token) {
        User user = jwtService.getUserByToken(token).orElseThrow(() -> new UserNotFoundException("이용자를 찾을 수 없습니다."));
        return new UserResponseDTO(
                user.getId(),
                user.getNickname(),
                user.getName(),
                user.getEmail(),
                user.getProfileImage()
        );
    }

    @GetMapping("/nickname")
    public String getUserNicknameById(@RequestHeader("Authorization") String token) {
        User user = jwtService.getUserByToken(token).orElseThrow(() -> new UserNotFoundException("이용자를 찾을 수 없습니다."));
        System.out.println("userNickname: " + user.getNickname());
        return user.getNickname();
    }

    @GetMapping("/turtle")
    public ResponseEntity<List<TurtleResponseDTO>> getTurtlesByUserId(@RequestHeader("Authorization") String token) {
        // 유저 없을 때 에러 던져주기
        User user = jwtService.getUserByToken(token).orElseThrow(() -> new UserNotFoundException("이용자를 찾을 수 없습니다."));
        // 사용자가 소유한 거북이 정보를 조회하는 로직
        List<TurtleResponseDTO> turtles = userService.getTurtlesByUserId(user.getId());
        log.info("거북이 정보: {}", turtles);
        if (turtles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(turtles);
    }


    // !~!~userId 토큰에서 가져오는거 여기 참고하기~!~!
    @GetMapping("/transaction")
    public ResponseEntity<?> myTransaction(@RequestHeader("Authorization") String token){
        Optional<User> user = jwtService.getUserByToken(token); // token 기준으로 User 객체 가져오기!
        if(user.isEmpty()){
            return new ResponseEntity<>(ResponseVO.failure("400","유효한 token이 아닙니다."),HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(ResponseVO.success("요청이 정상적으로 처리되었습니다.","transaction",transactionService.findAllTransactions(user.get()) ),HttpStatus.OK);
    }

}
