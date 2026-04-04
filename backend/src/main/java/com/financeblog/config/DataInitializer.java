package com.financeblog.config;

import com.financeblog.entity.User;
import com.financeblog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@financeblog.in");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setFullName("Admin User");
            admin.setRole(User.Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
            System.out.println("✅ Default admin created: admin / Admin@123");
        }

        if (!userRepository.existsByUsername("author")) {
            User author = new User();
            author.setUsername("author");
            author.setEmail("author@financeblog.in");
            author.setPassword(passwordEncoder.encode("Author@123"));
            author.setFullName("Rahul Sharma");
            author.setBio("Senior Financial Advisor with 10+ years experience in Indian markets. SEBI Registered. CA by qualification.");
            author.setRole(User.Role.AUTHOR);
            author.setActive(true);
            userRepository.save(author);
            System.out.println("✅ Default author created: author / Author@123");
        }
    }
}
