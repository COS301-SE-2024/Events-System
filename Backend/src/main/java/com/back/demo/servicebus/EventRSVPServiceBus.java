package com.back.demo.servicebus;

import com.back.demo.model.EventRSVP;

import java.util.List;
import java.util.Optional;

public interface EventRSVPServiceBus {
    List<EventRSVP> getAllEventRSVPs();
    Optional<EventRSVP> getEventRSVPById(Long id);
    EventRSVP createEventRSVP(EventRSVP eventRSVP);
    EventRSVP updateEventRSVP(Long id, EventRSVP eventRSVP);
    void deleteEventRSVP(Long id);
}
