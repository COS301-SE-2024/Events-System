package com.back.demo.servicebus;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.back.demo.model.Event;

public interface EventServiceBus {
    List<Event> getAllEvents();
    Optional<Event> getEventById(Long eventId);
    List<Event> getEventByHostId(Long hostId);
    Event createEvent(Event event);
    Event updateEvent(Long eventId, Event eventDetails);
    void deleteEvent(Long eventId);
    Event partialUpdateEvent(Long eventId, Map<String, Object> updates);
    List<Event> getEventsAttended(Long employeeId);
    List<Event> getUpcomingEvents(Long employeeId);
}
