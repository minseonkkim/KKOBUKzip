package com.turtlecoin.mainservice.domain.transaction.entity;

public enum TransactionProgress {
    AVAILABLE, PENDING_DEPOSIT, RESERVED, UNDER_REVIEW, COMPLETED // 판매중 / 서류검토 / 서류승인 / 거래완료
}