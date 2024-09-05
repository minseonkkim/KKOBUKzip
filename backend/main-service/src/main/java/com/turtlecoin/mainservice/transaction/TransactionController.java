package com.turtlecoin.mainservice.transaction;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/main/transaction")
public class TransactionController {
    @GetMapping("/test")
    public String test() {
        return "Hi! It's Test!!";
    }
}
