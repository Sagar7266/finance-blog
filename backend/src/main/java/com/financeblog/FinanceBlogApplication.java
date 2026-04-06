package com.financeblog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class FinanceBlogApplication {
    public static void main(String[] args) {

        SpringApplication.run(FinanceBlogApplication.class, args);
    }
}
