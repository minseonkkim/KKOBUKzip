package com.turtlecoin.mainservice.domain.transaction.repository;

import com.turtlecoin.mainservice.domain.transaction.entity.Transaction;
import com.turtlecoin.mainservice.domain.transaction.entity.TransactionProgress;
import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import feign.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // 모든 거래를 반환하는 메서드
    List<Transaction> findAll();

    // 필터링과 페이지네이션을 지원하는 메서드
    @Query("SELECT t FROM Transaction t WHERE (:gender IS NULL OR t.turtle.gender = :gender) " +
            "AND (:sizeMin IS NULL OR t.turtle.weight >= :sizeMin) " +
            "AND (:sizeMax IS NULL OR t.turtle.weight <= :sizeMax) " +
            "AND (:priceMin IS NULL OR t.price >= :priceMin) " +
            "AND (:priceMax IS NULL OR t.price <= :priceMax) " +
            "AND (:progressList IS NULL OR t.progress IN :progressList)")
    Page<Transaction> findFilteredTransactions(@Param("gender") Gender gender,
                                               @Param("sizeMin") Double sizeMin,
                                               @Param("sizeMax") Double sizeMax,
                                               @Param("priceMin") Double priceMin,
                                               @Param("priceMax") Double priceMax,
                                               @Param("progressList") List<TransactionProgress> progressList,
                                               Pageable pageable);
    Transaction findOneById(Long id);
}
