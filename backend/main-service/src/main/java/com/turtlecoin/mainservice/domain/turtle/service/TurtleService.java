package com.turtlecoin.mainservice.domain.turtle.service;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.turtlecoin.mainservice.domain.turtle.dto.AuctionTurtleInfoDTO;
import com.turtlecoin.mainservice.domain.turtle.dto.TurtleResponseDTO;
import com.turtlecoin.mainservice.domain.turtle.entity.Gender;
import com.turtlecoin.mainservice.domain.turtle.entity.QTurtle;
import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
import com.turtlecoin.mainservice.domain.turtle.repository.TurtleRepository;
import com.turtlecoin.mainservice.global.exception.TurtleNotFoundException;
import com.turtlecoin.mainservice.global.response.ResponseVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
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

    public Turtle findTurtleByUUID(String uuid) {
        Optional<Turtle> turtleOptional = turtleRepository.findByUUID(uuid);
		return turtleOptional.orElse(null);
    }

    @Transactional
    public void saveTurtle(Turtle turtle) {
        turtleRepository.save(turtle);
    }

    public ResponseEntity<?> getTurtleById(Long turtleId) {
        try {
            Turtle turtle = turtleRepository.findById(turtleId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 ID의 거북이를 찾을 수 없습니다."));

            TurtleResponseDTO data = TurtleResponseDTO.builder()
                    .id(turtle.getId())
                    .weight(turtle.getWeight())
                    .gender(turtle.getGender())
                    .userId(turtle.getUser().getId())
                    .build();
            return new ResponseEntity<>(ResponseVO.success("거북이가 정상적으로 조회되었습니다.", "turtle", data), HttpStatus.OK);
        }
        catch (TurtleNotFoundException e) {
            return new ResponseEntity<>(ResponseVO.failure("400", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
        catch (Exception e) {
            return new ResponseEntity<>(ResponseVO.failure("500","거북이 조회 과정 중에 서버 에러가 발생하였습니다."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
