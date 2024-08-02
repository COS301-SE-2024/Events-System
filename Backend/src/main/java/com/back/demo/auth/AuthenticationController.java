package com.back.demo.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.back.demo.repository.TokenRepository;
import com.back.demo.model.Token;

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
        Optional<Token> optionalToken = tokenRepository.findByToken(sessionToken);
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

    @PostMapping("/google")
    public String handleGoogleCallback(@RequestParam("code") String authorizationCode) {
    // Exchange the authorization code for tokens
    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
    map.add("code", authorizationCode);
    map.add("client_id", "");
    map.add("client_secret", "");
    map.add("redirect_uri", "{baseUrl}/api/v1/auth/google");
    map.add("grant_type", "authorization_code");

    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

    ResponseEntity<Map> response = restTemplate.postForEntity(
        "https://oauth2.googleapis.com/token",
        request,
        Map.class
    );

    // Extract the ID token from the response
    String idToken = (String) response.getBody().get("id_token");

    return "ID Token: " + idToken;
}
}
