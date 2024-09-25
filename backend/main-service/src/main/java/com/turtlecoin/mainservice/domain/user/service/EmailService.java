package com.turtlecoin.mainservice.domain.user.service;

import com.turtlecoin.mainservice.domain.user.dto.EmailDto;
import com.turtlecoin.mainservice.global.response.ResponseVO;
import io.lettuce.core.RedisConnectionException;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender emailSender;
    private final RedisTemplate<String,String> redisTemplate;
    private final UserService userService;
    final String AuthCode = "VerifyCode";

    // 이메일 인증코드 발송하기
    public ResponseVO<?> sendCodeToEmail(String email) {
        String title = "꼬북집 KKOBUKZIP 이메일 인증번호";
        String code = this.createCode();

        try {
            // 이메일 전송
            sendEmail(email, title, "인증번호 : " + code);

            // Redis에 인증 코드 저장
            redisTemplate.opsForValue().set(AuthCode + email, code, 180, TimeUnit.SECONDS);
        } catch (RedisConnectionException e) {
            log.error("Redis 연결 오류: {}", e.getMessage(), e);
            return ResponseVO.failure("500", "이메일 발송 중 오류가 발생하였습니다. (Redis 연결 오류)");
        } catch (Exception e) {
            log.error("알 수 없는 오류 발생: {}", e.getMessage(), e);
            return ResponseVO.failure("500", "이메일 발송 중 알 수 없는 오류가 발생하였습니다.");
        }

        return ResponseVO.success("이메일이 정상적으로 발송되었습니다.");
    }

    // 이메일 인증코드 검증하기
    public ResponseVO<?> verifyCode(EmailDto emailDto){
        ValueOperations<String, String> valueOps = redisTemplate.opsForValue();
        String storedCode = valueOps.get(AuthCode+emailDto.getEmail());
        Map<String, Object> responseBody = new HashMap<>();
        if(storedCode==null||!storedCode.equals(emailDto.getVerification())){
            return ResponseVO.failure("401","인증번호가 일치하지 않습니다.");
        }
        return ResponseVO.success("이메일 인증이 완료되었습니다.");
    }
    
    // 이메일 발송 함수
    private void sendEmail(String email, String title, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(title);
        message.setText(text);
        try{
            emailSender.send(message);
        }catch (Exception e){
            log.error(e.getMessage());
            throw new RuntimeException(e);
        }

    }

    // 랜텀 숫자 코드 생성
    private String createCode() {
        int lenth = 6;
        try {
            Random random = SecureRandom.getInstanceStrong();
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < lenth; i++) {
                builder.append(random.nextInt(10));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException e) {
            log.debug("MemberService.createCode() exception occur");
            throw new RuntimeException(e);
        }
    }

    // 발송할 이메일 형식 지정하기
    private SimpleMailMessage createEmailForm(String toEmail,
                                              String title,
                                              String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(title);
        message.setText(text);

        return message;
    }


}
