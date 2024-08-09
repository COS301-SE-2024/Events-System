package com.back.demo.controller;

import com.back.demo.model.EventSeries;
import com.back.demo.service.EventSeriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventseries")
public class EventSeriesController {

    @Autowired
    private EventSeriesService eventSeriesService;

    @GetMapping
    public List<EventSeries> getAllEventSeries() {
        return eventSeriesService.getAllEventSeries();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventSeries> getEventSeriesById(@PathVariable(value = "id") Long seriesId) {
        EventSeries eventSeries = eventSeriesService.getEventSeriesById(seriesId)
                .orElseThrow(() -> new RuntimeException("EventSeries not found"));
        return ResponseEntity.ok().body(eventSeries);
    }

    @PostMapping
    public EventSeries createEventSeries(@RequestBody EventSeries eventSeries) {
        return eventSeriesService.createEventSeries(eventSeries);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventSeries> updateEventSeries(@PathVariable(value = "id") Long seriesId,
                                                         @RequestBody EventSeries eventSeriesDetails) {
        EventSeries updatedEventSeries = eventSeriesService.updateEventSeries(seriesId, eventSeriesDetails);
        return ResponseEntity.ok(updatedEventSeries);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEventSeries(@PathVariable(value = "id") Long seriesId) {
        eventSeriesService.deleteEventSeries(seriesId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/host/{hostId}")
    public List<EventSeries> getEventSeriesByHostId(@PathVariable Integer hostId) {
        return eventSeriesService.getEventSeriesByHostId(hostId);
    }
}