package com.back.demo.servicebus;

import com.back.demo.model.Event;
import com.back.demo.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EventServiceBusImpl implements EventServiceBus {

    private final EventService eventService;

    @Autowired
    public EventServiceBusImpl(EventService eventService) {
        this.eventService = eventService;
    }

    @Override
    public List<Event> getEventBySocialClubId(Long socialClubId) {
        return eventService.getEventBySocialClubId(socialClubId);
    }

    @Override
    public List<Event> getAllEvents() {
        // Additional logic such as logging or notifications can be added here
        return eventService.getAllEvents();
    }

    @Override
    public Optional<Event> getEventById(Long eventId) {
        // Additional logic such as logging or notifications can be added here
        return eventService.getEventById(eventId);
    } 

    @Override
    public List<Event> getEventByHostId(Long hostId) {
        // Additional logic such as logging or notifications can be added here
        return eventService.getEventByHostId(hostId);
    }

    @Override
    public Event createEvent(Event event) {
        // Additional logic such as logging or notifications can be added here
        return eventService.createEvent(event);
    }

    @Override
    public Event updateEvent(Long eventId, Event eventDetails) {
        // Additional logic such as logging or notifications can be added here
        return eventService.updateEvent(eventId, eventDetails);
    }

    @Override
    public void deleteEvent(Long eventId) {
        // Additional logic such as logging or notifications can be added here
        //Users who have subscribed to the event will be notified of the deletion/cancellation of the event
        eventService.deleteEvent(eventId);
    }

    @Override
    public Event partialUpdateEvent(Long eventId, Map<String, Object> updates) {
        // Additional logic such as logging or notifications can be added here
        //If an event is partially updated, the eventService will update the event with the given updates
        //Users who have subscribed to the event will be notified of the changes
        return eventService.partialUpdateEvent(eventId, updates);
    }

    @Override
    public List<Event> getEventsAttended(Long employeeId) {
        // Additional logic such as logging or notifications can be added here
        return eventService.getEventsAttended(employeeId);
    }

    @Override
    public List<Event> getUpcomingEvents(Long employeeId) {
        // Additional logic such as logging or notifications can be added here
        return eventService.getUpcomingEvents(employeeId);
    }
}
