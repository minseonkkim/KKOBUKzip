package com.turtlecoin.mainservice.domain.user.service;

import com.turtlecoin.mainservice.domain.s3.service.ImageUploadService;
import com.turtlecoin.mainservice.domain.turtle.dto.TurtleResponseDTO;
import com.turtlecoin.mainservice.domain.user.dto.UserRequestDto;
import com.turtlecoin.mainservice.domain.user.dto.UserResponseDTO;
import com.turtlecoin.mainservice.domain.user.entity.Role;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.exception.DuplicatedUserEmail;
import com.turtlecoin.mainservice.domain.user.repository.UserRepository;
import com.turtlecoin.mainservice.global.exception.S3SaveException;
import com.turtlecoin.mainservice.global.response.ResponseVO;
import io.jsonwebtoken.Jwts;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ImageUploadService imageUploadService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;


    @Transactional
    public ResponseEntity<ResponseVO<?>> saveUser(UserRequestDto dto, MultipartFile image) {
        dto.setPassword(bCryptPasswordEncoder.encode(dto.getPassword()));
        // 이메일 중복 체크
        try {
            if (userRepository.findByemail(dto.getEmail()) != null) {
                throw new DuplicatedUserEmail("이미 가입된 이메일입니다.");
            }

            Role role = (dto.getRole() == null) ? Role.ROLE_USER : dto.getRole();
            String uuid = UUID.randomUUID().toString();
            String imageUrl = null;

            try{
                imageUrl = imageUploadService.upload(image, "user");
            }catch (IOException e){
                throw new S3SaveException("이미지 업로드 중 오류가 발생했습니다.");
            }

            // 사용자 객체 생성
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
                    imageUrl,
                    uuid
            );
            userRepository.save(user);
        }catch(DuplicatedUserEmail e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseVO.failure("401", e.getMessage()));
        }catch(S3SaveException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResponseVO.failure("500", e.getMessage()));
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseVO.failure("500", "예상치 못한 오류가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // 성공 메시지 반환
        return ResponseEntity.ok(ResponseVO.success("요청이 정상적으로 수행되었습니다."));
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

    public String getProfileImageByUserId(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return user.getProfileImage();
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

    public Boolean verifyPassword(UserRequestDto userDto){
        String password = userDto.getPassword();
        // 특수 문자를 포함하고 있으며 8자 이상
        String regex = "^(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$";

        // 정규식 패턴과 입력 비밀번호를 매칭
        Pattern pattern = Pattern.compile(regex);
        return pattern.matcher(password).matches();
    }

    public User getUserByUUID(String uuid) {
        Optional<User> userOption = userRepository.findUserByUUID(uuid);
		return userOption.orElse(null);
    }

    public User getUserByNameAndPhoneNumber(String name, String phonenumber) {
        Optional<User> userOption = userRepository.findUserByNameAndPhoneNumber(name, phonenumber);
        return userOption.orElse(null);
    }

    public User getUserByEmail(String email) {
        Optional<User> userOptional = Optional.ofNullable(userRepository.findByemail(email));
        return userOptional.orElse(null);
    }
}
