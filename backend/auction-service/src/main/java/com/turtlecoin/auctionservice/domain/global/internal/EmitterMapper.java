package com.turtlecoin.auctionservice.domain.global.internal;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class EmitterMapper{
	String uuid;
	SseEmitter emitter;
}