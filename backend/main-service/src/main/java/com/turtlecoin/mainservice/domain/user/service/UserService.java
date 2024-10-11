package com.turtlecoin.mainservice.domain.user.service;

import com.turtlecoin.mainservice.domain.chat.service.SseService;
import com.turtlecoin.mainservice.domain.s3.service.ImageUploadService;
import com.turtlecoin.mainservice.domain.turtle.dto.TurtleResponseDTO;
import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import com.turtlecoin.mainservice.domain.user.dto.*;
import com.turtlecoin.mainservice.domain.user.entity.Role;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.exception.DuplicatedUserEmail;
import com.turtlecoin.mainservice.domain.user.exception.IssueTokenException;
import com.turtlecoin.mainservice.domain.user.exception.UserNotFoundException;
import com.turtlecoin.mainservice.domain.user.repository.UserRepository;
import com.turtlecoin.mainservice.global.exception.RedisSaveException;
import com.turtlecoin.mainservice.global.exception.S3SaveException;
import com.turtlecoin.mainservice.global.response.ResponseVO;

import io.jsonwebtoken.Jwts;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ImageUploadService imageUploadService;
    private final JWTService jwtService;
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

    //로그인 하는 메소드
    public ResponseEntity<?> loginUser(LoginUserDto dto) {
        try{
            Optional<User> user = Optional.ofNullable(userRepository.findByemail(dto.getEmail()));
            if(user.isEmpty()|| !bCryptPasswordEncoder.matches(dto.getPassword(),user.get().getPassword())){
                throw new UserNotFoundException("아이디 혹은 비밀번호가 일치하지 않습니다.");
            }
            Map<String,Object> data = jwtService.issueToken(user);

            ResponseVO responseVO = ResponseVO.success("200","data",data);
            return ResponseEntity.ok(responseVO);

        }catch(UserNotFoundException e){
            return new ResponseEntity<>(ResponseVO.failure("401", e.getMessage()), HttpStatus.UNAUTHORIZED);
        }catch(RedisSaveException e){
            return new ResponseEntity<>(ResponseVO.failure("500", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }catch(IssueTokenException e){
            return new ResponseEntity<>(ResponseVO.failure("500", e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }catch(Exception e){
            return new ResponseEntity<>(ResponseVO.failure("500", "로그인 과정에서 예상치 못한 에러가 발생하였습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public UserResponseDTO getByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        //얍
        return UserResponseDTO.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .name(user.getName())
                .address(user.getAddress())
                .birth(user.getBirth())
                .profileImage(user.getProfileImage())
                .build();
    }

    public String getProfileImageByUserId(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return user.getProfileImage();
    }

    public List<FeignTurtleResponseDTO> getTurtlesdtoByUserId(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
            List<FeignTurtleResponseDTO> dtos = user.getTurtles().stream()
                    .map(turtle -> FeignTurtleResponseDTO.builder()
                            .id(turtle.getId())
                            .gender(turtle.getGender())
                            .birth(turtle.getBirth())
                            .weight(turtle.getWeight())
                            .userId(user.getId())
                            .build())
                    .toList();
            return dtos;
        } catch (Exception e) {
            log.info("에러 메시지 : " + e.getMessage());
            return null;
        }
    }

    public ResponseEntity<?> getTurtlesByUserId (Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
            List<UserTurtleResponseDTO> dtos =  user.getTurtles().stream()
                    .map(turtle -> UserTurtleResponseDTO.builder()
                            .id(turtle.getId())
                            .name(turtle.getName())
                            .turtleUuid(turtle.getUuid())
                            .scientificName(turtle.getScientificName())
                            .gender(turtle.getGender())
                            .weight(turtle.getWeight())
                            .birth(turtle.getBirth())
                            .dead(turtle.isDead())
                            .imageAddress(turtle.getTurtlePhotos().isEmpty() ? null : turtle.getTurtlePhotos().get(0).getImage())
                            .weight(turtle.getWeight())
                            .gender(turtle.getGender())
                            .motherName(turtle.getMom() != null ? turtle.getMom().getName() : "")
                            .motherImageAddress(turtle.getMom() != null ? turtle.getMom().getTurtlePhotos().get(0).getImage() : "")
                            .fatherName(turtle.getDad() != null ? turtle.getDad().getName() : "")
                            .fatherImageAddress(turtle.getDad() != null ? turtle.getDad().getTurtlePhotos().get(0).getImage() : "")
                            .build())
                    .toList();
            int cnt = dtos.size();
            log.info("cnt : {}", cnt);
            Map<String, Object> data = new HashMap<>();

            data.put("data", dtos);
            data.put("cnt", cnt);

            return new ResponseEntity<>(ResponseVO.success("거북이 목록 조회에 성공했습니다.", "data", data), HttpStatus.OK);
        } catch (NumberFormatException e) {
            // 숫자 형식이 잘못된 경우 예외 처리
            return new ResponseEntity<>(ResponseVO.failure("400", "잘못된 형식의 입력값이 있습니다."), HttpStatus.BAD_REQUEST);

        } catch (IllegalArgumentException e) {
            // 기타 잘못된 인자 처리
            return new ResponseEntity<>(ResponseVO.failure("400", "잘못된 파라미터입니다."), HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            // 기타 예외 처리 (서버 오류)
            log.error(e.getMessage());
            return new ResponseEntity<>(ResponseVO.failure("500", "서버 에러가 발생했습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
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
