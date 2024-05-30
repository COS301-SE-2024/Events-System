package com.back.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BackendConroller {

    @GetMapping("/control")
    public String healthCheck() {
        return "deployed automatically";
    }
}