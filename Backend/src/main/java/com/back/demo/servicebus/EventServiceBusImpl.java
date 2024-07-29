package com.back.demo.servicebus;

import com.back.demo.model.Event;
import com.back.demo.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EventServiceBusImpl implements EventServiceBus {

    private final EventService eventService;

    @Autowired
    public EventServiceBusImpl(EventService eventService) {
        this.eventService = eventService;
    }

    @Override
    public List<Event> getEventsAttended(Long employeeId) {
        return eventService.getEventsAttended(employeeId);
    }

    @Override
    public List<Event> getUpcomingEvents(Long employeeId) {
        return eventService.getUpcomingEvents(employeeId);
    }
}
