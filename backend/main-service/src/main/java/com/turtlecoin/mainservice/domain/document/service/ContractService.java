package com.turtlecoin.mainservice.domain.document.service;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContractService {
	private final Web3j web3j;
	private final Credentials credentials;
	private final ContractGasProvider contractGasProvider;
	// smartcontract의 주소
	private final String contractAddress = "0x275b279353A759A660503aD6292be0D6746E9B3b";

	@Autowired
	public ContractService(Web3j web3j) {
		this.web3j = web3j;
		// 관리 계정의 private key
		this.credentials = Credentials.create("0x151dfd83c1e517199a90cbf12d4f9c87c9692ff4bf4f9b61ad218775041e0e23"); // 개인 키

		// 가스 가격과 가스 한도 설정
		BigInteger gasPrice = BigInteger.valueOf(20_000_000_000L); // 20 Gwei
		BigInteger gasLimit = BigInteger.valueOf(6721975); // 300,000

		// StaticGasProvider를 이용한 설정
		StaticGasProvider gasProvider = new StaticGasProvider(gasPrice, gasLimit);

		this.contractGasProvider = gasProvider;
	}

	// 스마트 컨트랙트 로드
	public contract.TurtleDocumentation loadTurtleDocumentationContract() {
		return contract.TurtleDocumentation.load(contractAddress, web3j, credentials, contractGasProvider);
	}

	// 인공증식서류 등록
	public String registerTurtleMultiplicationDocument(
		String turtleUUID, String applicant, BigInteger count, String area,
		String purpose,	String location, String fatherUUID, String motherUUID,
		String locationSpecification, String multiplicationMethod, String shelterSpecification) throws Exception {

		contract.TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		TransactionReceipt receipt =  turtleDocumentation.registerTurtleMultiplicationDocument(
			turtleUUID, applicant, count, area, purpose, location, fatherUUID, motherUUID, locationSpecification, multiplicationMethod, shelterSpecification
		).send();

		if (receipt.isStatusOK()) {
			System.out.println("Transaction successful.");
		} else {
			System.out.println("Transaction failed or did not change state.");
		}

		// 이벤트 호출
		List<contract.TurtleDocumentation.TurtleMultiplicationEventResponse> events = contract.TurtleDocumentation.getTurtleMultiplicationEvents(receipt);

		byte[] documentHash = null;
		documentHash = events.get(0).documentHash;

		StringBuilder hexString = new StringBuilder();
		for (byte b : documentHash) {
			// %02X는 대문자 Hex를 생성합니다.
			hexString.append(String.format("%02X", b));
		}

		return hexString.toString();
	}

	// 인공증식서류 조회
	public contract.TurtleDocumentation.Multiplication searchTurtleMultiplicationDocument(String turtleUUID, String documentHash) throws Exception {
		contract.TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		byte[] byteArray = documentHash.getBytes(StandardCharsets.UTF_8);
		return turtleDocumentation.searchTutleMultiplicationDocument(turtleUUID, byteArray).send();
	}

	// 양수서류 등록
	public String registerTurtleAssigneeDocument(
		String turtleUUID, String applicant, String assigneeID,
		BigInteger count, String transferReason, String purpose
	) throws Exception {
		contract.TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		TransactionReceipt receipt = turtleDocumentation.registerTurtleAssigneeDocument(
			turtleUUID, applicant, assigneeID, count, transferReason, purpose
		).send();

		// 이벤트 호출
		List<contract.TurtleDocumentation.TurtleMultiplicationEventResponse> events = contract.TurtleDocumentation.getTurtleMultiplicationEvents(receipt);

		byte[] documentHash = null;
		documentHash = events.get(0).documentHash;

		StringBuilder hexString = new StringBuilder();
		for (byte b : documentHash) {
			// %02X는 대문자 Hex를 생성합니다.
			hexString.append(String.format("%02X", b));
		}

		return hexString.toString();
	}

	// 양도서류 등록
	public String registerTurtleGrantorDocument(
		String turtleUUID, String applicant, String documentHash, String grantorID,
		String aquisition, String fatherUUID, String motherUUID
	) throws Exception {
		byte[] byteArray = documentHash.getBytes(StandardCharsets.UTF_8);
		contract.TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		TransactionReceipt receipt = turtleDocumentation.registerTurtleGrantorDocument(
			turtleUUID, applicant, byteArray, grantorID, aquisition, fatherUUID, motherUUID
		).send();

		// 이벤트 호출
		List<contract.TurtleDocumentation.TurtleMultiplicationEventResponse> events = contract.TurtleDocumentation.getTurtleMultiplicationEvents(receipt);

		byte[] returnDocumentHash = null;
		returnDocumentHash = events.get(0).documentHash;

		StringBuilder hexString = new StringBuilder();
		for (byte b : returnDocumentHash) {
			// %02X는 대문자 Hex를 생성합니다.
			hexString.append(String.format("%02X", b));
		}

		return hexString.toString();
	}

	// 양도양수서류 조회
	public contract.TurtleDocumentation.Transfer searchTurtleTransferDocument(String turtleUUID, String documentHash) throws Exception {
		contract.TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		byte[] byteArray = documentHash.getBytes(StandardCharsets.UTF_8);
		return turtleDocumentation.searchTurtleTransferDocument(turtleUUID, byteArray).send();
	}

	// 폐사질병서류 등록
	public String registerTurtleDeathDocument(
		String turtleUUID, String applicant, String shelter,BigInteger count,
		String deathReason, String plan, String deathImage, String diagnosis
	) throws Exception {
		contract.TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		TransactionReceipt receipt = turtleDocumentation.registerTurtlerDeathDocument(
			turtleUUID, applicant, shelter, count, deathReason, plan, deathImage, diagnosis
		).send();

		// 이벤트 호출
		List<contract.TurtleDocumentation.TurtleMultiplicationEventResponse> events = contract.TurtleDocumentation.getTurtleMultiplicationEvents(receipt);

		byte[] returnDocumentHash = null;
		returnDocumentHash = events.get(0).documentHash;

		StringBuilder hexString = new StringBuilder();
		for (byte b : returnDocumentHash) {
			// %02X는 대문자 Hex를 생성합니다.
			hexString.append(String.format("%02X", b));
		}

		return hexString.toString();
	}

	// 폐사질병서류 조회
	public contract.TurtleDocumentation.Death searchTurtleDeathDocument(String turtleUUID, String documentHash) throws Exception {
		contract.TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		byte[] byteArray = documentHash.getBytes(StandardCharsets.UTF_8);
		return turtleDocumentation.searchTurtleDeathDocument(turtleUUID, byteArray).send();
	}
}