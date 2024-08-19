package com.back.demo.service;

import com.back.demo.model.Analytics;
import com.back.demo.repository.AnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnalyticsService {
    
    @Autowired
    private AnalyticsRepository analyticsRepository;

    public List<Analytics> findAll() {
        return analyticsRepository.findAll();
    }

    public Optional<Analytics> findById(Integer id) {
        return analyticsRepository.findById(id);
    }

    public Analytics save(Analytics analytics) {
        return analyticsRepository.save(analytics);
    }

    public void deleteById(Integer id) {
        analyticsRepository.deleteById(id);
    }

    //Will implement patch endpoint code
}
