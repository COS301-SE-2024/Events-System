package com.back.demo.service;

import com.back.demo.model.EventRSVP;
import com.back.demo.repository.EventRSVPRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public EventRSVP createEventRSVP(EventRSVP eventRSVP) {
        return eventRSVPRepository.save(eventRSVP);
    }

    public EventRSVP updateEventRSVP(Long id, EventRSVP eventRSVP) {
        if (eventRSVPRepository.existsById(id)) {
            eventRSVP.setRsvpId(id);
            return eventRSVPRepository.save(eventRSVP);
        } else {
            throw new RuntimeException("EventRSVP not found");
        }
    }

    public void deleteEventRSVP(Long id) {
        eventRSVPRepository.deleteById(id);
    }

    public List<EventRSVP> getEventRSVPsByEventId(Integer eventId) {
        return eventRSVPRepository.findByEventId(eventId);
    }
}
