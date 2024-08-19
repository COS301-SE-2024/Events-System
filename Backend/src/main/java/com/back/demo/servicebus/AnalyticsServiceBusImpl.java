package com.back.demo.servicebus;

import com.back.demo.model.Analytics;
import com.back.demo.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnalyticsServiceBusImpl implements AnalyticsServiceBus {

    private final AnalyticsService analyticsService;

    @Autowired
    public AnalyticsServiceBusImpl(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @Autowired
    public List<Analytics> getAllAnalyticsEntries(){
        return analyticsService.findAll();
    }

    @Override
    public Optional<Analytics> getAnalyticsForAnEmployee(Integer employeeId){
        return analyticsService.findByEmployeeId(employeeId);
    }
}