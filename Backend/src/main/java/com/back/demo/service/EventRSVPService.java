package com.back.demo.service;

import com.back.demo.model.Employee;
import com.back.demo.model.EventRSVP;
import com.back.demo.repository.EmployeeRepository;
import com.back.demo.repository.EventRSVPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EventRSVPService {

    @Autowired
    private EventRSVPRepository eventRSVPRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

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

        public List<Map<String, Object>> getRSVPsWithEmployeeDetailsByEventId(Integer eventId) {
        List<EventRSVP> rsvps = eventRSVPRepository.findByEventId(eventId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (EventRSVP rsvp : rsvps) {
            Optional<Employee> employeeOpt = employeeRepository.findById(rsvp.getEmployeeId().longValue());
            if (employeeOpt.isPresent()) {
                Map<String, Object> rsvpWithEmployeeDetails = new HashMap<>();
                rsvpWithEmployeeDetails.put("rsvp", rsvp);
                rsvpWithEmployeeDetails.put("employee", employeeOpt.get());
                result.add(rsvpWithEmployeeDetails);
            }
        }

        return result;
    }
}
