package com.back.demo.servicebus;

import java.util.List;

import com.back.demo.model.Event;

public interface EventServiceBus {
    List<Event> getEventsAttended(Long employeeId);
    List<Event> getUpcomingEvents(Long employeeId);
}
