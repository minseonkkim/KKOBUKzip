package com.turtlecoin.mainservice.global.util;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import lombok.Getter;

@Component
public class AESUtil {
	private SecretKey secretKey;

	private static final String ALGORITHM = "AES";

	// 비밀 키 생성
	public SecretKey generateKey() throws Exception {
		KeyGenerator keyGen = KeyGenerator.getInstance(ALGORITHM);
		keyGen.init(256); // 128, 192, 256 비트 키 길이
		return keyGen.generateKey();
	}

	public String encrypt(String data) throws Exception {
		Cipher cipher = Cipher.getInstance(ALGORITHM);
		cipher.init(Cipher.ENCRYPT_MODE, secretKey);
		byte[] encryptedBytes = cipher.doFinal(data.getBytes());

		// URL-safe Base64 encoding
		String base64Encrypted = Base64.getUrlEncoder().withoutPadding().encodeToString(encryptedBytes);

		return base64Encrypted; // URL-safe 하게 변환된 Base64 문자열 반환
	}

	// AES 복호화
	public String decrypt(String encryptedData) throws Exception {
		// URL-safe Base64 decoding
		byte[] base64Encrypted = Base64.getUrlDecoder().decode(encryptedData); // URL-safe Base64 디코딩
		Cipher cipher = Cipher.getInstance(ALGORITHM);
		cipher.init(Cipher.DECRYPT_MODE, secretKey);
		byte[] decryptedBytes = cipher.doFinal(base64Encrypted);
		return new String(decryptedBytes);
	}

	public void changeKey() throws Exception {
		this.secretKey = generateKey();
	}
}
