package com.back.demo.controller;

import com.back.demo.model.Analytics;
import com.back.demo.servicebus.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsServiceBus analyticsServiceBus;

    @GetMapping
    public List<Analytics> getAllAnalytics() {
        return analyticsServiceBus.getAllAnalyticsEntries();
    }

    //Endpoint to get analytics for a particular employee
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<Analytics> getAnalyticsForEmployee(@PathVariable Integer employeeId) {
        Optional<Analytics> analytics = analyticsServiceBus.getAnalyticsForAnEmployee(employeeId);
        if (analytics.isPresent()) {
            return ResponseEntity.ok(analytics.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
}
