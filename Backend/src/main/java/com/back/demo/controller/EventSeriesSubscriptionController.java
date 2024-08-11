package com.back.demo.controller;

import com.back.demo.model.EventSeriesSubscription;
import com.back.demo.service.EventSeriesSubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/eventseriessubscriptions")
public class EventSeriesSubscriptionController {

    @Autowired
    private EventSeriesSubscriptionService eventSeriesSubscriptionService;

    @GetMapping
    public List<EventSeriesSubscription> getAllSubscriptions() {
        return eventSeriesSubscriptionService.getAllSubscriptions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventSeriesSubscription> getSubscriptionById(@PathVariable Long id) {
        Optional<EventSeriesSubscription> subscription = eventSeriesSubscriptionService.getSubscriptionById(id);
        return subscription.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public EventSeriesSubscription createSubscription(@RequestBody EventSeriesSubscription subscription) {
        return eventSeriesSubscriptionService.createSubscription(subscription);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventSeriesSubscription> updateSubscription(@PathVariable Long id, @RequestBody EventSeriesSubscription subscriptionDetails) {
        EventSeriesSubscription updatedSubscription = eventSeriesSubscriptionService.updateSubscription(id, subscriptionDetails);
        return ResponseEntity.ok(updatedSubscription);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        eventSeriesSubscriptionService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }
}