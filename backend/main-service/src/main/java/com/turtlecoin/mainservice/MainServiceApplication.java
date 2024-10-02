package com.turtlecoin.mainservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@EnableJpaAuditing
public class MainServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(MainServiceApplication.class, args);
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		String rawPassword = "kkobuk107!";
		String encodedPassword = encoder.encode(rawPassword);
		System.out.println("encodedPassword");
		System.out.println(encodedPassword);
	}

}
