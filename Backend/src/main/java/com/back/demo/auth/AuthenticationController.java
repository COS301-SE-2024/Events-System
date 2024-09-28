package com.back.demo.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.back.demo.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken.TokenType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.back.demo.repository.EmployeeRepository;
import com.back.demo.repository.TokenRepository;
import com.back.demo.model.Token;
import com.back.demo.model.Employee;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request,
            HttpServletResponse response
    ) {
        return ResponseEntity.ok(service.authenticate(request, response));
    }

    @Autowired
    private TokenRepository tokenRepository;

    @GetMapping("/{sessionToken}")
    public ResponseEntity<Long> getEmployeeId(@PathVariable String sessionToken) {
        Optional<Token> optionalToken = tokenRepository.findByTokenIgnoreCase(sessionToken);
        if (optionalToken.isPresent()) {
            Token token = optionalToken.get();
            return ResponseEntity.ok(token.getUser().getEmployeeId());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }

    @Autowired
    private EmployeeRepository employeeRepository;
    
    private final JwtService jwtService;

    @PostMapping("/google")
    public ResponseEntity<AuthenticationResponse> handleGoogleCallback(
        @RequestBody OAuth2Response request,
        HttpServletResponse response
    ) {
        return ResponseEntity.ok(service.signInWithGoogle(request, response));
    }

    @GetMapping("/google/refresh")
    public ResponseEntity<String> getGoogleRefreshToken(@RequestBody String email) {
        // Fetch the employee by email or another unique identifier
        Optional<Employee> optionalEmployee = employeeRepository.findByEmailIgnoreCase(email);
        if (optionalEmployee.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Employee employee = optionalEmployee.get();

        // Fetch the Google refresh token from the database
        Optional<Token> googleToken = tokenRepository.findByUserIdAndTokenType(employee.getEmployeeId(), "GOOGLE");

        if (googleToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Google token not found.");
        }

        // Return the refresh token
        String refreshToken = googleToken.get().getToken();
        return ResponseEntity.ok(refreshToken);
    }
}
