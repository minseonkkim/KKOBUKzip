package com.turtlecoin.mainservice.domain.transaction.service;

import org.springframework.stereotype.Service;

import com.turtlecoin.mainservice.domain.transaction.entity.Transaction;
import com.turtlecoin.mainservice.domain.transaction.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {
	private final TransactionRepository transactionRepository;

	public Transaction findTransactionById(Long id) {
		return transactionRepository.findById(id).orElse(null);
	}
}
