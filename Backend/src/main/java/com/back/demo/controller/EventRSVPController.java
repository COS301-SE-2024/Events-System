package com.back.demo.controller;

import com.back.demo.model.EventRSVP;
import com.back.demo.servicebus.EventRSVPServiceBus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/event-rsvps")
public class EventRSVPController {

    @Autowired
    private EventRSVPServiceBus eventRSVPServiceBus;

    @GetMapping
    @Cacheable(value = "event-rsvps", key = "#root.methodName")
    public List<EventRSVP> getAllEventRSVPs() {
        return eventRSVPServiceBus.getAllEventRSVPs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventRSVP> getEventRSVPById(@PathVariable Long id) {
        Optional<EventRSVP> eventRSVP = eventRSVPServiceBus.getEventRSVPById(id);
        return eventRSVP.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public EventRSVP createEventRSVP(@RequestBody EventRSVP eventRSVP) {
        return eventRSVPServiceBus.createEventRSVP(eventRSVP);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventRSVP> updateEventRSVP(@PathVariable Long id, @RequestBody EventRSVP eventRSVP) {
        try {
            EventRSVP updatedEventRSVP = eventRSVPServiceBus.updateEventRSVP(id, eventRSVP);
            return ResponseEntity.ok(updatedEventRSVP);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEventRSVP(@PathVariable Long id) {
        eventRSVPServiceBus.deleteEventRSVP(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/event/{eventId}")
    public List<EventRSVP> getEventRSVPsByEventId(@PathVariable Integer eventId) { 
        return eventRSVPServiceBus.getEventRSVPsByEventId(eventId);
    }
}
