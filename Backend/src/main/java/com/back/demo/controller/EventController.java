package com.back.demo.controller;

import com.back.demo.model.Event;
import com.back.demo.servicebus.EventServiceBus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventServiceBus eventServiceBus;

    @Autowired
    public EventController(EventServiceBus eventServiceBus) {
        this.eventServiceBus = eventServiceBus;
    }

    @GetMapping("/socialclub/{id}")
    public List<Event> getEventBySocialClubId(@PathVariable(value = "id") Long socialClubId) {
        return eventServiceBus.getEventBySocialClubId(socialClubId);
    }

    @GetMapping
    @Cacheable(value = "events", key = "#root.methodName") 
    public List<Event> getAllEvents() {
        return eventServiceBus.getAllEvents();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable(value = "id") Long eventId) {
        Optional<Event> event = eventServiceBus.getEventById(eventId);
        return event.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/host/{id}")
    public List<Event> getEventByHostId(@PathVariable(value = "id") Long hostId) {
        return eventServiceBus.getEventByHostId(hostId);
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventServiceBus.createEvent(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable(value = "id") Long eventId,
                                             @RequestBody Event eventDetails) {
        try {
            Event updatedEvent = eventServiceBus.updateEvent(eventId, eventDetails);
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable(value = "id") Long eventId) {
        try {
            eventServiceBus.deleteEvent(eventId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Event> partialUpdateEvent(@PathVariable(value = "id") Long eventId,
                                                    @RequestBody Map<String, Object> updates) {
        try {
            Event updatedEvent = eventServiceBus.partialUpdateEvent(eventId, updates);
            return ResponseEntity.ok(updatedEvent);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // @GetMapping("/employee/{employeeId}/events-attended")
    // public List<Event> getEventsAttended(@PathVariable Long employeeId) {
    //     return eventService.getEventsAttended(employeeId); 
    // }

    // @GetMapping("/employee/{employeeId}/upcoming-events")
    // public List<Event> getUpcomingEvents(@PathVariable Long employeeId) {
    //     return eventService.getUpcomingEvents(employeeId);
    // }

    @GetMapping("/employee/{employeeId}/events-attended")
    public List<Event> getEventsAttended(@PathVariable Long employeeId) {
        return eventServiceBus.getEventsAttended(employeeId);
    }

    @GetMapping("/employee/{employeeId}/upcoming-events")
    public List<Event> getUpcomingEvents(@PathVariable Long employeeId) {
        return eventServiceBus.getUpcomingEvents(employeeId);
    }

    @GetMapping("/search")
    public List<Event> searchEventsByTitle(@RequestParam String title) {
        return eventServiceBus.getEventsByTitle(title);
    }

}