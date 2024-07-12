package com.back.demo.service;

import com.back.demo.model.Event;
import com.back.demo.repository.EventRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.sql.Date;
import java.sql.Time;

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

    public List<Event> getEventByHostId(Long hostId) {
        return eventRepository.findAllHostEvents(hostId);
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
            event.setStartDate(eventDetails.getStartDate());
            event.setEndDate(eventDetails.getEndDate());
            event.setLocation(eventDetails.getLocation());
            event.setHostId(eventDetails.getHostId());
            event.setGeolocation(eventDetails.getGeolocation());
            event.setSocialClub(eventDetails.getSocialClub());
            event.setEventPictureLink(eventDetails.getEventPictureLink());
            event.setEventAgendas(eventDetails.getEventAgendas());
            event.setEventPreparation(eventDetails.getEventPreparation());
            event.setEventDietaryAccommodations(eventDetails.getEventDietaryAccommodations());
            event.setTags(eventDetails.getTags());
            return eventRepository.save(event);
        } else {
            throw new RuntimeException("Event not found with id " + eventId);
        }
    }

    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    public Event partialUpdateEvent(Long eventId, Map<String, Object> updates) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
            updates.forEach((key, value) -> {
                switch (key) {
                    case "title":
                        event.setTitle((String) value);
                        break;
                    case "description":
                        event.setDescription((String) value);
                        break;
                    case "startTime":
                        event.setStartTime(Time.valueOf((String) value));
                        break;
                    case "endTime":
                        event.setEndTime(Time.valueOf((String) value));
                        break;
                    case "startDate":
                        event.setStartDate(Date.valueOf((String) value));
                        break;
                    case "endDate":
                        event.setEndDate(Date.valueOf((String) value));
                        break;
                    case "location":
                        event.setLocation((String) value);
                        break;
                    case "geolocation":
                        event.setGeolocation((String) value);
                        break;
                    case "socialClub":
                        event.setSocialClub((Integer) value);
                        break;
                    case "eventPictureLink":
                        event.setEventPictureLink((String) value);
                        break;
                    case "eventAgendas":
                        event.setEventAgendas(convertToStringArray(value));
                        break;
                    case "eventPreparation":
                        event.setEventPreparation(convertToStringArray(value));
                        break;
                    case "eventDietaryAccommodations":
                        event.setEventDietaryAccommodations(convertToStringArray(value));
                        break;
                    case "tags":
                        event.setTags(convertToStringArray(value));
                        break;
                    default:
                        throw new IllegalArgumentException("Invalid attribute: " + key);
                }
            });
            return eventRepository.save(event);
        } else {
            throw new RuntimeException("Event not found with id " + eventId);
        }
    }

    private String[] convertToStringArray(Object value) {
        if (value instanceof List) {
            List<?> list = (List<?>) value;
            return list.toArray(new String[0]);
        } else if (value instanceof String[]) {
            return (String[]) value;
        } else {
            throw new IllegalArgumentException("Expected value to be a list or array of strings");
        }
    }
}
