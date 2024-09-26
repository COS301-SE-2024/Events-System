package com.back.demo.service;

import com.back.demo.model.EventRSVP;
import com.back.demo.repository.EventRSVPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventRSVPService {

    @Autowired
    private EventRSVPRepository eventRSVPRepository;

    public List<EventRSVP> getAllEventRSVPs() {
        return eventRSVPRepository.findAll();
    }

    public Optional<EventRSVP> getEventRSVPById(Long id) {
        return eventRSVPRepository.findById(id);
    }

    @CacheEvict(value = "event-rsvps", key = "'getAllEventRSVPs'")
    public EventRSVP createEventRSVP(EventRSVP eventRSVP) {
        return eventRSVPRepository.save(eventRSVP);
    }

    @CacheEvict(value = "event-rsvps", key = "'getAllEventRSVPs'")
    public EventRSVP updateEventRSVP(Long id, EventRSVP eventRSVP) {
        if (eventRSVPRepository.existsById(id)) {
            eventRSVP.setRsvpId(id);
            return eventRSVPRepository.save(eventRSVP);
        } else {
            throw new RuntimeException("EventRSVP not found");
        }
    }

    @CacheEvict(value = "event-rsvps", key = "'getAllEventRSVPs'")
    public void deleteEventRSVP(Long id) {
        eventRSVPRepository.deleteById(id);
    }

    public List<EventRSVP> getEventRSVPsByEventId(Integer eventId) {
        return eventRSVPRepository.findByEventId(eventId);
    }

    public boolean userHasRSVPForEvent(Integer employeeId, Integer eventId) {
        return eventRSVPRepository.findByEmployeeIdAndEventId(employeeId, eventId).isPresent();
    }

    @CacheEvict(value = "event-rsvps", key = "'getAllEventRSVPs'")
    public void removeRSVPForEvent(Integer employeeId, Integer eventId) {
        Optional<EventRSVP> rsvp = eventRSVPRepository.findByEmployeeIdAndEventId(employeeId, eventId);
        rsvp.ifPresent(eventRSVPRepository::delete);
    }
}
