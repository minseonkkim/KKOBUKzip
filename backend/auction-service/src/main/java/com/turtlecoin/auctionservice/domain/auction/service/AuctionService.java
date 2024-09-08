package com.turtlecoin.auctionservice.domain.auction.service;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.turtlecoin.auctionservice.domain.auction.dto.AuctionResponseDTO;
import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
import com.turtlecoin.auctionservice.domain.auction.entity.QAuction;
import com.turtlecoin.auctionservice.domain.auction.repository.AuctionRepository;
import com.turtlecoin.auctionservice.domain.turtle.dto.TurtleResponse;
import com.turtlecoin.auctionservice.domain.turtle.service.TurtleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuctionService {

    private final AuctionRepository auctionRepository;

    @Autowired
    private final JPAQueryFactory queryFactory;
    @Autowired
    private TurtleService turtleService;

    @Transactional
    public void save(Auction auction) {
        auctionRepository.save(auction);
    }

//    public List<AuctionResponseDTO> getAuction(String gender, Double minSize, Double maxSize, Double minPrice, Double maxPrice, String progress, int page) {
//        QAuction auction = QAuction.auction;
//
//     List<Auction> filteredAuctions = quaryFactory
//    }

    public Optional<Auction> getAuctionWithTurtleInfo(Long auctionId) {
        Optional<Auction> auction = auctionRepository.findById(auctionId);

        auction.ifPresent(a -> {
            TurtleResponse turtleInfo = turtleService.getTurtleInfo(a.getTurtleId());
            log.info("Turtle Info: {}", turtleInfo);
        });

        return auction;
    }
}
