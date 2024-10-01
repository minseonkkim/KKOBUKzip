package com.turtlecoin.mainservice.domain.chat.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.turtlecoin.mainservice.domain.chat.service.SseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/main/notifications")
@RequiredArgsConstructor
public class SseController {
	private final SseService sseService;

	@GetMapping(value = "/subscribe/{id}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public SseEmitter subscribe(@PathVariable Long id) {
		return sseService.subscribe(id);
	}

	@PostMapping("/send-data/{id}")
	public void sendData(@PathVariable Long id) {
		sseService.notify(id, "data");
	}
}
