package com.turtlecoin.mainservice.domain.user.controller;

import com.turtlecoin.mainservice.domain.s3.service.ImageUploadService;
import com.turtlecoin.mainservice.domain.transaction.service.TransactionService;
import com.turtlecoin.mainservice.domain.turtle.dto.TurtleResponseDTO;
import com.turtlecoin.mainservice.domain.user.dto.*;
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

import java.io.IOException;
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
    private final ImageUploadService imageUploadService;


    public UserController(EmailService emailService, UserService userService, JWTService jwtService, TransactionService transactionService, UserRepository userRepository, ImageUploadService imageUploadService) {
        this.emailService = emailService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.transactionService = transactionService;
        this.userRepository = userRepository;
        this.imageUploadService = imageUploadService;
    }

    @PostMapping(value="/join",consumes={MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ResponseVO<?>> joinProcess(
            @RequestPart("data") UserRequestDto userDto,
            @RequestPart(value = "profileImage", required = false) MultipartFile image) {
        return userService.saveUser(userDto,image);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginUserDto loginUserDto) {
        return userService.loginUser(loginUserDto);
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
            return new ResponseEntity<>(ResponseVO.failure("500", "예상치 못한 오류가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
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
            return new ResponseEntity<>(ResponseVO.failure("500", "예상치 못한 오류가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/")
    // 유저 없을 때 에러 던져주기
    public UserResponseDTO getUserById(@RequestHeader("Authorization") String token) {
        User user = jwtService.getUserByToken(token).orElseThrow(() -> new UserNotFoundException("이용자를 찾을 수 없습니다."));
        return new UserResponseDTO(
                user.getId(),
                user.getUuid(),
                user.getNickname(),
                user.getEmail(),
                user.getName(),
                user.getAddress(),
                user.getBirth(),
                user.getProfileImage()
        );
    }

    @GetMapping("/{userId}")
    // 유저 없을 때 에러 던져주기
    public UserResponseDTO getUserById(@PathVariable("userId") Long userId) {
        return userService.getByUserId(userId);
    }

    @GetMapping("/{userId}/turtle")
    // 유저 없을 때 에러 던져주기
    public List<FeignTurtleResponseDTO> getTurtlesByUserId(@PathVariable("userId") Long userId) {
        // 유저 없을 때 에러 던져주기
        return userService.getTurtlesdtoByUserId(userId);
    }

    @GetMapping("/nickname")
    public String getUserNicknameById(@RequestHeader("Authorization") String token) {
        User user = jwtService.getUserByToken(token).orElseThrow(() -> new UserNotFoundException("이용자를 찾을 수 없습니다."));
        System.out.println("userNickname: " + user.getNickname());
        return user.getNickname();
    }

    @GetMapping("/turtle")
    public ResponseEntity<?> getTurtlesByUserId(@RequestHeader("Authorization") String token) {
        // 유저 없을 때 에러 던져주기
        User user = jwtService.getUserByToken(token).orElseThrow(() -> new UserNotFoundException("이용자를 찾을 수 없습니다."));
        // 사용자가 소유한 거북이 정보를 조회하는 로직
        return userService.getTurtlesByUserId(user.getId());
    }

    // !~!~userId 토큰에서 가져오는거 여기 참고하기~!~!
    @GetMapping("/transaction")
    public ResponseEntity<?> myTransaction(@RequestHeader("Authorization") String token){
        Optional<User> user = jwtService.getUserByToken(token); // token 기준으로 User 객체 가져오기!
        if(user.isEmpty()){
            return new ResponseEntity<>(ResponseVO.failure("404","유효한 token이 아닙니다."),HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(ResponseVO.success("요청이 정상적으로 처리되었습니다.","transaction",transactionService.findAllTransactions(user.get()) ),HttpStatus.OK);
    }

    @PatchMapping(value="/image",consumes={MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> modifyMyProfileImage(
            @RequestHeader("Authorization") String token,
            @RequestPart("profileImage") MultipartFile image) {
        try{
            Optional<User> user = jwtService.getUserByToken(token);
            if(user.isEmpty()){
                throw new UserNotFoundException("유효한 토큰이 아닙니다.");
            }
            if(user.get().getProfileImage() != null){
                try{
                    imageUploadService.deleteS3(user.get().getProfileImage());
                }catch (Exception e){
                    user.get().modifyProfileImage("");
                    userRepository.save(user.get());
                    throw new Exception("이미지 삭제 실패");
                }
            }

            String url = imageUploadService.upload(image,"user");
            user.get().modifyProfileImage(url);
            userRepository.save(user.get());
            return new ResponseEntity<>(ResponseVO.success("이미지가 성공적으로 수정 되었습니다.","url",url),HttpStatus.OK);
        }catch(UserNotFoundException e){
            return new ResponseEntity<>(ResponseVO.failure("404",e.getMessage()),HttpStatus.UNAUTHORIZED);

        }catch (IOException e) {
            // 이미지 업로드 중 IO 예외 발생 시
            return new ResponseEntity<>(ResponseVO.failure("500", "이미지 업로드 중 오류가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);

        } catch (Exception e) {
            // 기타 예외 발생 시
            return new ResponseEntity<>(ResponseVO.failure("500", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
