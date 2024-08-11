package com.back.demo.service;

import com.back.demo.model.EventSeriesSubscription;
import com.back.demo.repository.EventSeriesSubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventSeriesSubscriptionService {

    @Autowired
    private EventSeriesSubscriptionRepository eventSeriesSubscriptionRepository;

    public List<EventSeriesSubscription> getAllSubscriptions() {
        return eventSeriesSubscriptionRepository.findAll();
    }

    public Optional<EventSeriesSubscription> getSubscriptionById(Long id) {
        return eventSeriesSubscriptionRepository.findById(id);
    }

    public EventSeriesSubscription createSubscription(EventSeriesSubscription subscription) {
        return eventSeriesSubscriptionRepository.save(subscription);
    }

    public EventSeriesSubscription updateSubscription(Long id, EventSeriesSubscription subscriptionDetails) {
        EventSeriesSubscription subscription = eventSeriesSubscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        subscription.setSeriesId(subscriptionDetails.getSeriesId());
        subscription.setEmployeeId(subscriptionDetails.getEmployeeId());
        return eventSeriesSubscriptionRepository.save(subscription);
    }

    public void deleteSubscription(Long id) {
        eventSeriesSubscriptionRepository.deleteById(id);
    }
}