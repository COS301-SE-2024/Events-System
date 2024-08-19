package com.back.demo.servicebus;

import com.back.demo.model.Analytics;

import java.util.List;
import java.util.Optional;

public interface AnalyticsServiceBus {
    public List<Analytics> getAllAnalyticsEntries();
    Optional<Analytics> getAnalyticsForAnEmployee(Integer employeeId);
}
