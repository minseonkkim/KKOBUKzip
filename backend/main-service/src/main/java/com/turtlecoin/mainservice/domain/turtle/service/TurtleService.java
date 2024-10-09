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
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Slf4j
@RequiredArgsConstructor
public class TurtleService {
    private final TurtleRepository turtleRepository;
    private final JPAQueryFactory jpaQueryFactory;

    //거북이를 필터링해서 auction-service에 넘겨주기
    public List<AuctionTurtleInfoDTO> getFilteredTurtles(Gender gender, Double minSize, Double maxSize) {
        log.info("파라미터 체크 성별: {}, 최소 사이즈 : {}, 최대 사이즈: {}", gender, minSize, maxSize);
        System.out.println("요청 오는지 체크");
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
                .map(t -> {
                    // DTO 생성 및 반환
                    return new AuctionTurtleInfoDTO(
                            t.getId(),
                            t.getGender(),
                            "다이아몬드 백 테라핀",
                            t.getWeight(),
                            t.getBirth(),
                            t.getUser().getId()
                    );
                })
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

    public TurtleResponseDTO getTurtleById(Long turtleId) {
        log.info("거북이 아이디로 조회 시도");
        try {
            // 거북이 정보 조회
            Turtle turtle = turtleRepository.findById(turtleId)
                    .orElseThrow(() -> new TurtleNotFoundException("해당 ID의 거북이를 찾을 수 없습니다."));

            //
//            private Long id;
//            private Gender gender;
//            private String scientificName;
//            private int weight;
//            private Long userId;
//            private LocalDate birth;
            // DTO로 변환하여 반환
            return TurtleResponseDTO.builder()
                    .id(turtle.getId())
                    .weight(turtle.getWeight())
                    .gender(turtle.getGender())
                    .birth(turtle.getBirth())
                    .scientificName(turtle.getScientificName())
                    .userId(turtle.getUser().getId())
                    .build();

        } catch (TurtleNotFoundException e) {
            throw new TurtleNotFoundException("해당 ID의 거북이를 찾을 수 없습니다.");
        } catch (Exception e) {
            throw new RuntimeException("거북이 조회 과정 중에 서버 에러가 발생하였습니다.");
        }
    }

}
