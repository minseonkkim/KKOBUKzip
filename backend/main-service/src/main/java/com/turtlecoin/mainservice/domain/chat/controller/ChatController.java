package com.turtlecoin.mainservice.domain.chat.controller;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.turtlecoin.mainservice.domain.chat.dto.ChatListDto;
import com.turtlecoin.mainservice.domain.chat.dto.ChatResponseDto;
import com.turtlecoin.mainservice.domain.chat.service.ChatService;
import com.turtlecoin.mainservice.domain.transaction.service.TransactionService;
import com.turtlecoin.mainservice.domain.user.dto.UserResponseDTO;
import com.turtlecoin.mainservice.domain.user.entity.User;
import com.turtlecoin.mainservice.domain.user.service.UserService;
import com.turtlecoin.mainservice.domain.user.util.JWTUtil;
import com.turtlecoin.mainservice.domain.transaction.exception.TransactionNotFoundException;
import com.turtlecoin.mainservice.global.response.ResponseSingle;
import com.turtlecoin.mainservice.global.response.ResponseVO;

import lombok.RequiredArgsConstructor;

// 테스트를 위한 컨트롤러이므로 사용하지 않기
@RestController
@RequiredArgsConstructor
@RequestMapping("/main/chatting")
public class ChatController {
	private final ChatService chatService;
	private final JWTUtil jwtUtil;
	private final UserService userService;
	private final TransactionService transactionService;

	@GetMapping("/create")
	public ResponseEntity<?> createChat(@RequestParam Long id1, @RequestParam Long id2) {
		try{
			chatService.createChat(id1, id2);
		}
		catch(Exception e){
			return new ResponseEntity<>(ResponseVO.failure("400", "실패"), HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(ResponseVO.success("성공"), HttpStatus.OK);
	}

	@GetMapping("/add")
	public ResponseEntity<?> addChat(@RequestParam Long id1, @RequestParam Long id2 ,@RequestParam Long sender, @RequestParam String text) {
		try{
			// chatService.addChatMessage(id1, id2, sender, txt);
			chatService.addChatTextMessage(id1, id2, sender, text);
		}
		catch(Exception e){
			return new ResponseEntity<>(ResponseVO.failure("400", "실패"), HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(ResponseVO.success("성공"), HttpStatus.OK);
	}

	// 채팅창 목록 조회
	@GetMapping("/{memberId}")
	public ResponseEntity<?> listMyChats(@RequestHeader HttpHeaders header, Pageable pageable){
		String accessToken = header.getFirst("Authorization").split("Bearer ")[1].split(" ")[0];
		String userId = jwtUtil.getUsernameFromToken(accessToken);

		List<ChatListDto> list;
		try{
			User user = userService.getUserByEmail(userId);
			if(user == null){
				return new ResponseEntity<>(ResponseVO.failure("404", "사용자를 찾을 수 없습니다."), HttpStatus.BAD_REQUEST);
			}

			list = chatService.listChattingRoomList(user.getId(), pageable);
		}
		catch(IllegalArgumentException | TransactionNotFoundException e){
			return new ResponseEntity<>(ResponseVO.failure("404", e.getMessage()), HttpStatus.NOT_FOUND);
		}
		catch(Exception e){
			return new ResponseEntity<>(ResponseVO.failure("500", "조회 중 문제가 발생했습니다."), HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(ResponseSingle.success("채팅 기록 조회에 성공했습니다.", list), HttpStatus.OK);
	}

	// 채팅방 하나 디테일 조회
	@GetMapping("/detail")
	public ResponseEntity<?> listChatWithOpponent(@RequestHeader HttpHeaders header, @RequestParam("id") Long id, @RequestParam("type") String type ,Pageable pageable) {
		String accessToken = header.getFirst("Authorization").split("Bearer ")[1].split(" ")[0];
		String userId = jwtUtil.getUsernameFromToken(accessToken);

		List<ChatResponseDto> list;
		try{
			User user = userService.getUserByEmail(userId);
			if(user == null){
				return new ResponseEntity<>(ResponseVO.failure("404", "사용자를 찾을 수 없습니다."), HttpStatus.BAD_REQUEST);
			}

			if(type.equals("user")){
				UserResponseDTO opponent = userService.getByUserId(id);
				list = chatService.getChatDetailList(user.getId(), opponent.getUserId(), user.getId(), pageable);
			}
			else {
				list = chatService.getChatListFromTransaction(user.getId(), id, pageable);
			}

		}
		catch(IllegalArgumentException | TransactionNotFoundException e){
			return new ResponseEntity<>(ResponseVO.failure("404", e.getMessage()), HttpStatus.NOT_FOUND);
		}
		catch(Exception e){
			return new ResponseEntity<>(ResponseVO.failure("500", "조회 중 문제가 발생했습니다."), HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(ResponseSingle.success("채팅 기록 조회에 성공했습니다.", list), HttpStatus.OK);
	}
}
