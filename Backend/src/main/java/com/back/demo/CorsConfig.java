package com.back.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                 "http://localhost:4200",
                            "https://events-system.org") // Allow requests from any origin
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE") // Allowed HTTP methods
                        .allowCredentials(true)
                        .allowedHeaders("*"); // Allowed headers
            }
        };
    }
}

