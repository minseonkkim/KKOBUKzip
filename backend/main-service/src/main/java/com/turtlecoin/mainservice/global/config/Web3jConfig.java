package com.turtlecoin.mainservice.global.config;

import java.math.BigInteger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;

@Configuration
public class Web3jConfig {
    @Value("${contract.address}") // 스마트 계약 주소
    private String contractAddress;

    @Value("${account.key}") // 개인 키
    private String accountKey;

    @Bean
    public Web3j web3j() {
        return Web3j.build(new HttpService("https://1rpc.io/holesky")); // holesky
    }

    @Bean
    public ContractGasProvider contractGasProvider() {
        BigInteger gasPrice = BigInteger.valueOf(20_000_000_000L); // 20 Gwei
        BigInteger gasLimit = BigInteger.valueOf(6721975); // 6,721,975
        return new StaticGasProvider(gasPrice, gasLimit);
    }

    @Bean
    public String contractAddress() {
        return contractAddress;
    }

    @Bean
    public Credentials credentials() {
        return Credentials.create("0x" + accountKey);
    }

    @Bean
    TransactionManager transactionManager() {
        TransactionManager cutomerTokenTxManager = new RawTransactionManager(
            web3j(), credentials(), 17000);

        return cutomerTokenTxManager;
    }
}
