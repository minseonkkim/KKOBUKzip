package com.turtlecoin.mainservice.domain.chat.controller;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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
import com.turtlecoin.mainservice.global.util.AESUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/main/notifications")
@RequiredArgsConstructor
public class SseController {
	private final SseService sseService;
	private final UserService userService;
	private final JWTUtil jwtUtil;
	private final AESUtil aesUtil;
	private final RedisTemplate<String, String> redisTemplate;

	// @GetMapping(value = "/sse/subscribe/{id}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	// public SseEmitter subscribe(@PathVariable Long id, @RequestParam(name = "token", required = false) String token) {
	// 	try{
	// 		// 레디스에 있는 해당 유저의 토큰과 동일한지 확인
	// 		String sseToken = (String) redisTemplate.opsForHash().get("sseToken:" + id, "token");
	// 		// System.out.println("레디스: " + sseToken + " 인풋 : " + token);
	// 		if(sseToken != null && sseToken.equals(token)) {
	// 			return sseService.subscribe(id);
	// 		}
	// 		else {
	// 			// 만약 일치하지 않은 경우 새로 연결 가능한지 확인
	// 			Long userId = Long.parseLong(aesUtil.decrypt(token));
	// 			UserResponseDTO user = userService.getByUserId(userId);
	//
	// 			if(user != null && userId.equals(id)){
	// 				return sseService.subscribe(id);
	// 			}
	// 			else{
	// 				return null;
	// 			}
	// 		}
	// 	}
	// 	catch(Exception e){
	// 		return null;
	// 	}
	// }

	@GetMapping(value = "/sse/subscribe/{id}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter subscribe(@PathVariable Long id, @RequestHeader HttpHeaders headers) {
		try{
			String token = headers.getFirst("Authorization");
			Long userId = jwtUtil.getIdFromToken(token.substring(7));
			System.out.println(userId);

			if(id.equals(userId)) {
				return sseService.subscribe(id);
			}
			else{
				return null;
			}
		}
		catch(Exception e){
			return null;
		}
	}

	@PostMapping("/send-data/{id}")
	public void sendData(@PathVariable Long id) {
		sseService.notify(id, "data");
	}
}
