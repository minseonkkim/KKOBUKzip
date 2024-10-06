package com.turtlecoin.mainservice.global.scheduler;

import javax.crypto.SecretKey;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;

import com.turtlecoin.mainservice.global.util.AESUtil;

import lombok.Getter;

@Configuration
public class KeyScheduler {
	private final AESUtil aesUtil;

	KeyScheduler(AESUtil aesUtil) throws Exception {
		this.aesUtil = aesUtil;
		aesUtil.changeKey();
	}

	@Scheduled(fixedRate = 180000)
	public void checkKey() throws Exception {
		aesUtil.changeKey();
	}
}
