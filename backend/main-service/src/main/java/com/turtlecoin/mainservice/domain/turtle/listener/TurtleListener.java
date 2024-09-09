package com.turtlecoin.mainservice.domain.turtle.listener;

import com.turtlecoin.mainservice.domain.turtle.dto.TurtleRequestDTO;
import com.turtlecoin.mainservice.domain.turtle.dto.TurtleResponseDTO;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class TurtleListener {

    private final RabbitTemplate rabbitTemplate;

    public TurtleListener(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

//    @RabbitListener(queues = "turtleRequestQueue")
//    public void handleTurtleRequest(TurtleRequestDTO request) {
//        TurtleResponseDTO response = new TurtleResponseDTO(
//                request.getTurtleId(), "암컷", 11D, 10000D);
//        )
//
//        rabbitTemplate.convertAndSend("turtleResponseQueue", response);
//    }
}
