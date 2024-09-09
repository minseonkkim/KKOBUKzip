package com.turtlecoin.mainservice.domain.document.service;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;
import org.web3j.utils.Numeric;
import contract.TurtleDocumentation;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContractService {
	private final Web3j web3j;
	private final Credentials credentials;
	private final ContractGasProvider contractGasProvider;
	private final String contractAddress = "0x00F325b08e2aee857671E1394a39B592d6075927";

	@Autowired
	public ContractService(Web3j web3j) {
		this.web3j = web3j;
		this.credentials = Credentials.create("0x0611cce24ec1c2a08ad47d6cbdfe477f6288687ffd69359128e4b038e133e348"); // 개인 키

		// 가스 가격과 가스 한도 설정
		BigInteger gasPrice = BigInteger.valueOf(20_000_000_000L); // 20 Gwei
		BigInteger gasLimit = BigInteger.valueOf(300_000L); // 300,000

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

		// 이벤트 호출
		List<TurtleDocumentation.TurtleMultiplicationEventResponse> events = TurtleDocumentation.getTurtleMultiplicationEvents(receipt);

		byte[] documentHash = null;
		documentHash = events.get(0).documentHash;

		return new String(documentHash, StandardCharsets.UTF_8);
	}

	// 인공증식서류 조회
	public TurtleDocumentation.Multiplication searchTurtleDocumentationContract(String turtleUUID, String documentHash) throws Exception {
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
		List<TurtleDocumentation.TurtleMultiplicationEventResponse> events = TurtleDocumentation.getTurtleMultiplicationEvents(receipt);

		byte[] documentHash = null;
		documentHash = events.get(0).documentHash;

		return new String(documentHash, StandardCharsets.UTF_8);
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
		List<TurtleDocumentation.TurtleMultiplicationEventResponse> events = TurtleDocumentation.getTurtleMultiplicationEvents(receipt);

		byte[] returnDocumentHash = null;
		returnDocumentHash = events.get(0).documentHash;

		return new String(returnDocumentHash, StandardCharsets.UTF_8);
	}

	// 양도양수서류 조회
	public TurtleDocumentation.Transfer searchTurtleTransferDocument(String turtleUUID, String documentHash) throws Exception {
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
		TransactionReceipt receipt = turtleDocumentation.registerTurtleDeathDocument(
			turtleUUID, applicant, shelter, count, deathReason, plan, deathImage, diagnosis
		).send();

		// 이벤트 호출
		List<TurtleDocumentation.TurtleMultiplicationEventResponse> events = TurtleDocumentation.getTurtleMultiplicationEvents(receipt);

		byte[] returnDocumentHash = null;
		returnDocumentHash = events.get(0).documentHash;

		return new String(returnDocumentHash, StandardCharsets.UTF_8);
	}

	// 폐사질병서류 조회
	public TurtleDocumentation.Death searchTurtleDeathDocument(String turtleUUID, String documentHash) throws Exception {
		contract.TurtleDocumentation turtleDocumentation = loadTurtleDocumentationContract();
		byte[] byteArray = documentHash.getBytes(StandardCharsets.UTF_8);
		return turtleDocumentation.searchTurtleDeathDocument(turtleUUID, byteArray).send();
	}
}