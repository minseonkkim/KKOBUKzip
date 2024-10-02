package com.turtlecoin.mainservice.domain.transaction.service;

import com.turtlecoin.mainservice.domain.transaction.dto.AuctionResultDTO;
import com.turtlecoin.mainservice.domain.transaction.dto.TransactionRequestDto;
import com.turtlecoin.mainservice.domain.transaction.entity.Transaction;
import com.turtlecoin.mainservice.domain.transaction.entity.TransactionPhoto;
import com.turtlecoin.mainservice.domain.transaction.entity.TransactionProgress;
import com.turtlecoin.mainservice.domain.transaction.repository.TransactionRepository;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import com.turtlecoin.mainservice.domain.turtle.repository.TurtleRepository;
import com.turtlecoin.mainservice.global.exception.TurtleNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuctionReceiveService {

    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;
    private final TurtleRepository turtleRepository;

    @RabbitListener(queues = "auction.result.queue")
    public void receiveMessage(AuctionResultDTO auctionResultDTO) {
        Turtle turtle = turtleRepository.findById(auctionResultDTO.getTurtleId()).get();
        String imageAddress = auctionResultDTO.getImageAddress();

        Transaction transaction = Transaction.builder()
                .title(auctionResultDTO.getTitle())
                .content(auctionResultDTO.getContent())
                .sellerAddress(auctionResultDTO.getSellerAddress())
                .price(auctionResultDTO.getWinningBid())
                .progress(TransactionProgress.REVIEW_DOCUMENT) // 임시로 넣었음
                .documentHash("123143") // 임시로 넣었음
                .weight(auctionResultDTO.getWeight())
                .turtle(turtle)
                .auctionFlag(true)
                .buyerId(auctionResultDTO.getBuyerId())
                .build();

        if (imageAddress != null) {
            TransactionPhoto transactionPhoto = new TransactionPhoto(imageAddress, transaction);
            transaction.getTransactionPhotos().add(transactionPhoto);
        }

        transactionRepository.save(transaction);

        // 사진은 없음
//        transactionService.enrollTransaction(transaction, );
        System.out.println("Received message: " + auctionResultDTO.getTurtleId());
    }
}
