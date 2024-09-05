package com.turtlecoin.auctionservice.auction;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auction")
public class AuctionController {
    @GetMapping("/test")
    public String test() {
        return "It's auction test!";
    }
}
