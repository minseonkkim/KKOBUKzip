package com.turtlecoin.mainservice.domain.transaction.repository;

import com.turtlecoin.mainservice.domain.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

}
