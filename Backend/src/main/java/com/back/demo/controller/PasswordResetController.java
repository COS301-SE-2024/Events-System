package com.back.demo.controller;

import com.back.demo.model.Employee;
import com.back.demo.service.PasswordResetService;

import jakarta.mail.MessagingException;

import com.back.demo.repository.EmployeeRepository;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reset")
public class PasswordResetController {
    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private EmployeeRepository userRepository;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) throws MessagingException {
        String email = payload.get("email").toLowerCase(); // Convert input email to lowercase
        System.out.println("email: " + email);
        Optional<Employee> user1 = userRepository.findByEmailIgnoreCase(email);
        Employee user = user1.get();
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        String token = UUID.randomUUID().toString();
        passwordResetService.createPasswordResetTokenForUser(user, token);
        passwordResetService.sendPasswordResetEmail(email, token);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String password = payload.get("password");
        Optional<Employee> user = userRepository.findByEmployeeId(passwordResetService.validatePasswordResetToken(token));
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        passwordResetService.changeUserPassword(user, password, token);
        return ResponseEntity.ok().build();
    }
}