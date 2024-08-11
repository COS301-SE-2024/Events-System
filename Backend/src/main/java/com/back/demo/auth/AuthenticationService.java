package com.back.demo.auth;

import com.back.demo.model.Employee;
import com.back.demo.model.GoogleAuthRequest;
import com.back.demo.service.JwtService;
import com.back.demo.model.Token;
import com.back.demo.repository.TokenRepository;
import com.back.demo.config.TokenType;
import com.back.demo.model.Role;
import com.back.demo.repository.EmployeeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final EmployeeRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        Role role = "Host".equals(request.getRole()) ? Role.MANAGER : Role.USER;
        var user = Employee.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .dietaryRequirements(request.getDietaryRequirements())
                .role(role)
                .build();

        var savedUser = repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletResponse response) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            System.out.println("Authentication failed: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            throw e;
        }
        var user = repository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);

        Cookie jwtCookie = new Cookie("jwt", jwtToken);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true); 
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(60 * 60); 

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true); 
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(7 * 12 * 60 * 60); 

        response.addCookie(jwtCookie);
        response.addCookie(refreshTokenCookie);
        response.setStatus(HttpServletResponse.SC_OK);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    private void saveUserToken(Employee user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(Employee user) {
        var validUserTokens = tokenRepository.findAllValidTokenByEmployeeId(user.getEmployeeId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = this.repository.findByEmailIgnoreCase(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    public AuthenticationResponse signInWithGoogle(OAuth2Response oAuthRequest, HttpServletResponse response) {

        String email = oAuthRequest.getEmail();
        String firstName = oAuthRequest.getGiven_name();
        String lastName = oAuthRequest.getFamily_name();

        Optional<Employee> optionalEmployee = repository.findByEmail(email);
        Employee employee;
        
        if(optionalEmployee.isPresent())
        {
            employee = optionalEmployee.get();

        }
        else
        {
            employee = Employee.builder()
            .firstName(firstName)
            .lastName(lastName)
            .email(email)
            .password("")
            .dietaryRequirements("")
            .role(Role.USER) 
            .build();
            
            repository.save(employee);
        }
        
        var jwtToken = jwtService.generateToken(employee);
        var refreshToken = jwtService.generateRefreshToken(employee);

        revokeAllUserTokens(employee);
        saveUserToken(employee, jwtToken);

        response.setStatus(HttpServletResponse.SC_OK);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }
}
