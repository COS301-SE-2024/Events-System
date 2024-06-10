package com.back.demo.service;

import com.back.demo.model.Event;
import com.back.demo.repository.EventRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.sql.Date;
import java.sql.Time;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long eventId) {
        return eventRepository.findById(eventId);
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long eventId, Event eventDetails) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
            event.setTitle(eventDetails.getTitle());
            event.setDescription(eventDetails.getDescription());
            event.setStartTime(eventDetails.getStartTime());
            event.setEndTime(eventDetails.getEndTime());
            event.setStartDate(eventDetails.getStartDate());
            event.setEndDate(eventDetails.getEndDate());
            event.setLocation(eventDetails.getLocation());
            event.setHostId(eventDetails.getHostId());
            event.setGeolocation(eventDetails.getGeolocation());
            event.setSocialClub(eventDetails.getSocialClub());
            return eventRepository.save(event);
        } else {
            throw new RuntimeException("Event not found with id " + eventId);
        }
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    public Event partialUpdateEvent(Long eventId, Map<String, Object> updates) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
            updates.forEach((key, value) -> {
                switch (key) {
                    case "title":
                        event.setTitle((String) value);
                        break;
                    case "description":
                        event.setDescription((String) value);
                        break;
                    case "startTime":
                        event.setStartTime(Time.valueOf((String) value));
                        break;
                    case "endTime":
                        event.setEndTime(Time.valueOf((String) value));
                        break;
                    case "startDate":
                        event.setStartDate(Date.valueOf((String) value));
                        break;
                    case "endDate":
                        event.setEndDate(Date.valueOf((String) value));
                        break;
                    case "location":
                        event.setLocation((String) value);
                        break;
                    case "geolocation":
                        event.setGeolocation((String) value);
                        break;
                    case "socialClub":
                        event.setSocialClub((String) value);
                        break;
                    default:
                        throw new IllegalArgumentException("Invalid attribute: " + key);
                }
            });
            return eventRepository.save(event);
        } else {
            throw new RuntimeException("Event not found with id " + eventId);
        }
    }
    
}