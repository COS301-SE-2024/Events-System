package com.back.demo.service;

import com.back.demo.model.EventSeries;
import com.back.demo.model.Notification;
import com.back.demo.repository.EventSeriesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class EventSeriesService {

    @Autowired
    private EventSeriesRepository eventSeriesRepository;

    @Autowired
    private NotificationService notificationService;

    public List<EventSeries> getAllEventSeries() {
        return eventSeriesRepository.findAll();
    }

    public Optional<EventSeries> getEventSeriesById(Long seriesId) {
        return eventSeriesRepository.findById(seriesId);
    }

    public EventSeries createEventSeries(EventSeries eventSeries) {
        eventSeries.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        return eventSeriesRepository.save(eventSeries);
    }

    public EventSeries updateEventSeries(Long seriesId, EventSeries eventSeriesDetails) {
        EventSeries eventSeries = eventSeriesRepository.findById(seriesId)
                .orElseThrow(() -> new RuntimeException("EventSeries not found"));
        eventSeries.setName(eventSeriesDetails.getName());
        eventSeries.setDescription(eventSeriesDetails.getDescription());
        eventSeries.setSeriesEventIds(eventSeriesDetails.getSeriesEventIds());
        eventSeries.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        return eventSeriesRepository.save(eventSeries);


    }

    public void deleteEventSeries(Long seriesId) {
        eventSeriesRepository.deleteById(seriesId);
    }

    public List<EventSeries> getEventSeriesByHostId(Integer hostId) {
        return eventSeriesRepository.findByHostId(hostId);
    }
}