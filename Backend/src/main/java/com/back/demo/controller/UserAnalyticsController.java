// Backend/src/main/java/com/back/demo/controller/UserAnalyticsController.java
package com.back.demo.controller;

import com.back.demo.model.UserAnalytics;
import com.back.demo.service.UserAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user-analytics")
public class UserAnalyticsController {
    @Autowired
    private UserAnalyticsService userAnalyticsService;

    @GetMapping
    public List<UserAnalytics> getAllUserAnalytics() {
        return userAnalyticsService.getAllUserAnalytics();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserAnalytics> getUserAnalyticsById(@PathVariable Integer id) {
        Optional<UserAnalytics> userAnalytics = userAnalyticsService.getUserAnalyticsById(id);
        return userAnalytics.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public UserAnalytics createUserAnalytics(@RequestBody UserAnalytics userAnalytics) {
        return userAnalyticsService.createUserAnalytics(userAnalytics);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserAnalytics> updateUserAnalytics(@PathVariable Integer id, @RequestBody UserAnalytics userAnalyticsDetails) {
        return ResponseEntity.ok(userAnalyticsService.updateUserAnalytics(id, userAnalyticsDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserAnalytics(@PathVariable Integer id) {
        userAnalyticsService.deleteUserAnalytics(id);
        return ResponseEntity.noContent().build();
    }
}