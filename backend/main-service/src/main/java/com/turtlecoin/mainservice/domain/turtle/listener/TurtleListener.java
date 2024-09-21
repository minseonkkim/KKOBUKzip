//package com.turtlecoin.mainservice.domain.turtle.listener;
//
//import com.turtlecoin.mainservice.domain.turtle.dto.TurtleRequestDTO;
//import com.turtlecoin.mainservice.domain.turtle.dto.TurtleResponseDTO;
//import com.turtlecoin.mainservice.domain.turtle.entity.Turtle;
//import com.turtlecoin.mainservice.domain.turtle.repository.TurtleRepository;
//import com.turtlecoin.mainservice.global.exception.TurtleNotFoundException;
//import org.springframework.amqp.rabbit.annotation.RabbitListener;
//import org.springframework.amqp.rabbit.core.RabbitTemplate;
//import org.springframework.stereotype.Service;
//
//@Service
//public class TurtleListener {
//
//    private final RabbitTemplate rabbitTemplate;
//    private final TurtleRepository turtleRepository;
//
//    public TurtleListener(RabbitTemplate rabbitTemplate, TurtleRepository turtleRepository) {
//        this.rabbitTemplate = rabbitTemplate;
//        this.turtleRepository = turtleRepository;
//    }
//
//    @RabbitListener(queues = "turtleRequestQueue")
//    public void turtleRequest(TurtleRequestDTO request) {
//        Turtle turtle = turtleRepository.findById(request.getTurtleId())
//                .orElseThrow(() -> new TurtleNotFoundException("거북이를 조회할 수 없습니다."));
//        TurtleResponseDTO response = new TurtleResponseDTO(
//                turtle.getId(), turtle.getGender(), turtle.getWeight(), 300D
//        );
//
//        rabbitTemplate.convertAndSend("turtleResponseQueue", response);
//    }
//}
