package com.back.demo.servicebus;

import com.back.demo.model.EventRSVP;
import com.back.demo.service.EventRSVPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventRSVPServiceBusImpl implements EventRSVPServiceBus {

    @Autowired
    private EventRSVPService eventRSVPService;

    @Override
    public List<EventRSVP> getAllEventRSVPs() {
        return eventRSVPService.getAllEventRSVPs();
    }

    @Override
    public Optional<EventRSVP> getEventRSVPById(Long id) {
        return eventRSVPService.getEventRSVPById(id);
    }

    @Override
    public EventRSVP createEventRSVP(EventRSVP eventRSVP) {
        return eventRSVPService.createEventRSVP(eventRSVP);
    }

    @Override
    public EventRSVP updateEventRSVP(Long id, EventRSVP eventRSVP) {
        return eventRSVPService.updateEventRSVP(id, eventRSVP);
    }

    @Override
    public void deleteEventRSVP(Long id) {
        eventRSVPService.deleteEventRSVP(id);
    }
}
