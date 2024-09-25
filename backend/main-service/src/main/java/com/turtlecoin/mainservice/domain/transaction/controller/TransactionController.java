package com.turtlecoin.mainservice.domain.transaction.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/main/transaction")
public class TransactionController {
    @GetMapping("/test")
    public String test() {
        return "Hi! It's Test!!";
    }
//
//    @GetMapping("/")
//    public ResponseEntity<?> entireTransactions(@RequestParam("gender")String gender, ){
//
//
//    }
}
