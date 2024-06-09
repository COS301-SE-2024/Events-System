package com.back.demo.service;

import com.back.demo.model.Event;
import com.back.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
}
