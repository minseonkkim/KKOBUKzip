package com.turtlecoin.mainservice.domain.chat.controller;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.turtlecoin.mainservice.domain.chat.service.SseService;
import com.turtlecoin.mainservice.domain.user.dto.UserResponseDTO;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.service.JWTService;
import com.turtlecoin.mainservice.domain.user.service.UserService;
import com.turtlecoin.mainservice.domain.user.util.JWTUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/main/notifications")
@RequiredArgsConstructor
public class SseController {
	private final SseService sseService;
	private final UserService userService;
	private final JWTUtil jwtUtil;

	@GetMapping(value = "/sse/subscribe/{id}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public ResponseEntity<SseEmitter> subscribe(@PathVariable Long id, @RequestHeader HttpHeaders headers) {
		try{
			String token = headers.getFirst("Authorization");
			Long userId = jwtUtil.getIdFromToken(token.substring(7));

			HttpHeaders responseHeader = new HttpHeaders();
			responseHeader.add("Cache-Control", "no-cache");
			responseHeader.add("X-Accel-Buffering", "no");

			if(id.equals(userId)) {
				log.info(userId + "가 SSE 연결을 시도했습니다!");
				return new ResponseEntity<>(sseService.subscribe(id), responseHeader, HttpStatus.OK);
			}
			else{
				return null;
			}
		}
		catch(Exception e){
			return null;
		}
		// return sseService.subscribe(id);
	}

	@PostMapping("/send-data/{id}")
	public void sendData(@PathVariable Long id) {
		sseService.notify(id, "data");
	}
}
