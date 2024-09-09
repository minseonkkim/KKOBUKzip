//package com.turtlecoin.auctionservice.domain.auction.repository;
//
//import com.querydsl.jpa.impl.JPAQueryFactory;
//import com.turtlecoin.auctionservice.domain.auction.entity.Auction;
//import com.turtlecoin.auctionservice.domain.auction.entity.QAuction;
//import com.turtlecoin.auctionservice.domain.auction.entity.AuctionProgress;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//@RequiredArgsConstructor
//public class AuctionRepositoryCustomImpl implements AuctionRepositoryCustom{
//
//    private final JPAQueryFactory queryFactory;
//
//    @Override
//    public List<Auction> findAuctionByFilters(String gender, Double minSize, Double maxSize, Double minPrice, Double maxPrice, String progress, int page) {
//        QAuction auction = QAuction.auction;
//
//        return queryFactory.selectFrom(auction)
//                .where(
//                        // 거북이의 정보를 어떻게 가져와야할까?
//                        gender != null ? auction.tags.any().eq(gender) : null,
//                        minSize != null && maxSize != null ? auction.size.between(minSize, maxSize) : null,
//                        minPrice != null && maxPrice != null ? auction.minBid.between(minPrice, maxPrice) : null,
//                        progress != null ? auction.auctionProgress.eq(AuctionProgress.of(progress)) : null
//                )
//                .offset((page - 1) * 10)  // 페이지네이션 적용
//                .limit(10)
//                .fetch();
//    }
//}
