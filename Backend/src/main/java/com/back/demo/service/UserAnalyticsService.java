// Backend/src/main/java/com/back/demo/service/UserAnalyticsService.java
package com.back.demo.service;

import com.back.demo.model.UserAnalytics;
import com.back.demo.repository.UserAnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserAnalyticsService {
    @Autowired
    private UserAnalyticsRepository userAnalyticsRepository;

    public List<UserAnalytics> getAllUserAnalytics() {
        return userAnalyticsRepository.findAll();
    }

    public Optional<UserAnalytics> getUserAnalyticsById(Integer id) {
        return userAnalyticsRepository.findById(id);
    }

    public UserAnalytics createUserAnalytics(UserAnalytics userAnalytics) {
        return userAnalyticsRepository.save(userAnalytics);
    }

    public UserAnalytics updateUserAnalytics(Integer id, UserAnalytics userAnalyticsDetails) {
        UserAnalytics userAnalytics = userAnalyticsRepository.findById(id).orElseThrow(() -> new RuntimeException("UserAnalytics not found"));
        userAnalytics.setUserId(userAnalyticsDetails.getUserId());
        userAnalytics.setActionType(userAnalyticsDetails.getActionType());
        return userAnalyticsRepository.save(userAnalytics);
    }

    public void deleteUserAnalytics(Integer id) {
        userAnalyticsRepository.deleteById(id);
    }
}