package com.back.demo.controller;

import com.back.demo.model.EventRSVP;
import com.back.demo.service.EventRSVPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/event-rsvps")
public class EventRSVPController {

    @Autowired
    private EventRSVPService eventRSVPService;

    @GetMapping
    public List<EventRSVP> getAllEventRSVPs() {
        return eventRSVPService.getAllEventRSVPs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventRSVP> getEventRSVPById(@PathVariable Long id) {
        Optional<EventRSVP> eventRSVP = eventRSVPService.getEventRSVPById(id);
        return eventRSVP.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public EventRSVP createEventRSVP(@RequestBody EventRSVP eventRSVP) {
        return eventRSVPService.createEventRSVP(eventRSVP);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventRSVP> updateEventRSVP(@PathVariable Long id, @RequestBody EventRSVP eventRSVP) {
        try {
            EventRSVP updatedEventRSVP = eventRSVPService.updateEventRSVP(id, eventRSVP);
            return ResponseEntity.ok(updatedEventRSVP);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEventRSVP(@PathVariable Long id) {
        eventRSVPService.deleteEventRSVP(id);
        return ResponseEntity.noContent().build();
    }
}
