package com.turtlecoin.mainservice.domain.turtle.service;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.turtlecoin.mainservice.domain.turtle.dto.AuctionTurtleInfoDTO;
import com.turtlecoin.mainservice.domain.turtle.dto.TurtleResponseDTO;
import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import com.turtlecoin.mainservice.domain.turtle.entity.QTurtle;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import com.turtlecoin.mainservice.domain.turtle.repository.TurtleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class TurtleService {
    private final TurtleRepository turtleRepository;
    private final JPAQueryFactory jpaQueryFactory;

    //거북이를 필터링해서 auction-service에 넘겨주기
    public List<AuctionTurtleInfoDTO> getFilteredTurtles(Gender gender, Double minSize, Double maxSize) {
        QTurtle turtle = QTurtle.turtle;
        BooleanBuilder whereClause = new BooleanBuilder();

        if (gender != null) {
            whereClause.and(turtle.gender.eq(gender));
        }

        if (minSize != null) {
            if (maxSize != null) {
                whereClause.and(turtle.weight.between(minSize, maxSize));
            } else {
                whereClause.and(turtle.weight.goe(minSize));
            }
        } else if (maxSize != null) {
            whereClause.and(turtle.weight.loe(maxSize));
        }

        return jpaQueryFactory.selectFrom(turtle)
                .where(whereClause)
                .fetch()
                .stream()
                .map(t -> new AuctionTurtleInfoDTO(t.getId(), t.getGender(), t.getWeight()))  // 필요한 필드만 DTO로 변환
                .collect(Collectors.toList());
    }

    public TurtleResponseDTO getTurtleById(Long turtleId) {
        Turtle turtle = turtleRepository.findById(turtleId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 거북이를 찾을 수 없습니다."));

        return TurtleResponseDTO.builder()
                .id(turtle.getId())
                .weight(turtle.getWeight())
                .gender(turtle.getGender())
                .userId(turtle.getUser().getId())
                .build();

    }

}
