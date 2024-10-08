package com.turtlecoin.mainservice.domain.document.service;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import com.turtlecoin.mainservice.domain.document.entity.contract.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.Hash;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;

import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import com.turtlecoin.mainservice.domain.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@PropertySource("classpath:ethereum.properties")
public class ContractService {
	private final Web3j web3j;
	private final ContractGasProvider contractGasProvider;
	// smartcontract의 주소
	private final String contractAddress;
	private final TransactionManager transactionManager;

	// 스마트 컨트랙트 로드
	public TurtleDocumentation loadTurtleDocumentationContract() {
		return TurtleDocumentation.load(contractAddress, web3j, transactionManager, contractGasProvider);
	}

	// 비동기 등록
	public void registerTurtleMultiplicationDocumentAsync(String turtleUUID, String applicant, String documentHash, BigInteger count, String area,
		String purpose,	String location, String fatherUUID, String motherUUID,
		LocalDate birth, String name, int weight, Gender gender,
		String locationSpecification, String multiplicationMethod, String shelterSpecification){

		TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		byte[] byteArray = hexStringToByte32("0x" + documentHash);

		// 거북이 정보 해시함수 처리
		String turtleInfo = birth.toString() + weight + gender;
		System.out.println(turtleInfo);
		byte[] turtleHash = hexStringToByte32("0x" + keccak256(turtleInfo.getBytes()));

		turtleDocumentation.registerTurtleMultiplicationDocument(
			turtleUUID, applicant, byteArray, count, area, purpose, location, fatherUUID, motherUUID,
			birth.toString(), name, BigInteger.valueOf(weight), gender.toString(),
			locationSpecification, multiplicationMethod, shelterSpecification, turtleHash
		).sendAsync();
	}

	// 인공증식서류 조회
	public TurtleDocumentation.Multiplication searchTurtleMultiplicationDocument(String turtleUUID, String documentHash) throws Exception {
		TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		//byte[] byteArray = toByte32(hexStringToByteArray(documentHash));
		byte[] byteArray = hexStringToByte32("0x" + documentHash);

		return turtleDocumentation.searchTurtleMultiplicationDocument(turtleUUID, byteArray).send();
	}

	// 양수 서류 비동기 등록
	public void registerTurtleAssigneeDocumentAsync(
		String turtleUUID, String applicant, String documentHash, String assigneeID,
		BigInteger count, String transferReason, String purpose
	) throws Exception {
		TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		// byte로 변환
		byte[] byteArray = hexStringToByte32("0x" + documentHash);
		turtleDocumentation.registerTurtleAssigneeDocument(
			turtleUUID, applicant, byteArray, assigneeID, count, transferReason, purpose
		).sendAsync();
	}

	// 양도 서류 비동기 등록
	public void registerTurtleGrantorDocumentAsync(
		String turtleUUID, String applicant, String documentHash, String grantorID,
		String aquisition, String fatherUUID, String motherUUID
	) throws Exception {
		// byte로 변환
		byte[] byteArray = hexStringToByte32("0x" + documentHash);
		TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		turtleDocumentation.registerTurtleGrantorDocument(
			turtleUUID, applicant, byteArray, grantorID, aquisition, fatherUUID, motherUUID
		).sendAsync();
	}

	// 양도양수서류 조회
	public TurtleDocumentation.Transfer searchTurtleTransferDocument(String turtleUUID, String documentHash) throws Exception {
		TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		byte[] byteArray = hexStringToByte32("0x" + documentHash);
		return turtleDocumentation.searchTurtleTransferDocument(turtleUUID, byteArray).send();
	}

	// 폐사질병서류 비동기 등록
	public void registerTurtleDeathDocumentAsync(
		String turtleUUID, String applicant, String documentHash, String shelter,BigInteger count,
		String deathReason, String plan, String deathImage, String diagnosis
	) throws Exception {
		TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		// byte로 변환
		byte[] byteArray = hexStringToByte32("0x" + documentHash);
		turtleDocumentation.registerTurtleDeathDocument(
			turtleUUID, applicant, byteArray, shelter, count, deathReason, plan, deathImage, diagnosis
		).sendAsync();
	}

	// 폐사질병서류 조회
	public TurtleDocumentation.Death searchTurtleDeathDocument(String turtleUUID, String documentHash) throws Exception {
		TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		byte[] byteArray = hexStringToByte32("0x" + documentHash);
		return turtleDocumentation.searchTurtleDeathDocument(turtleUUID, byteArray).send();
	}

	// 가장 최근 서류 조회
	public String searchCurrentDocumentHash(String turtleUUID) throws Exception {
		TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();

		byte[] documentHash = turtleDocumentation.searchCurrentDocumentHash(turtleUUID).send();
		return byteToString(documentHash);
	}

	// 인공증식서류 승인
	public void approveBreeding(String turtleUUID, String documentHash) throws Exception {
		TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		byte[] byteArray = hexStringToByte32("0x" + documentHash);
		turtleDocumentation.approveMultiplicationDocByReviewer(turtleUUID, byteArray).sendAsync();
	}

	// 양도양수 승인
	public void approveTransfer(String turtleUUID, String documentHash) throws Exception {
		TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		byte[] byteArray = hexStringToByte32("0x" + documentHash);
		turtleDocumentation.approveTransferDocByReviewer(turtleUUID, byteArray).sendAsync();
	}

	// byte32로 변환하기
	public byte[] hexStringToByte32(String hex) {
		if (hex.startsWith("0x")) {
			hex = hex.substring(2);  // '0x' 제거
		}
		byte[] byteArray = new byte[32];
		int length = Math.min(hex.length() / 2, 32);

		for (int i = 0; i < length; i++) {
			byteArray[i] = (byte) ((Character.digit(hex.charAt(i * 2), 16) << 4)
				+ Character.digit(hex.charAt(i * 2 + 1), 16));
		}
		return byteArray;
	}

	// byte[] -> String
	public String byteToString(byte[] bytes){
		StringBuilder hexString = new StringBuilder();
		for (byte b : bytes) {
			// %02X는 대문자 Hex를 생성합니다.
			hexString.append(String.format("%02X", b));
		}
		return hexString.toString();
	}

	// keccak256 생성하기
	public String keccak256(byte[] input) {
		return byteToString(Hash.sha3(input)); // Keccak-256 해시 계산
	}
}