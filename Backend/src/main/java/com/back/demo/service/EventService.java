package com.back.demo.service;

import com.back.demo.model.Event;
import com.back.demo.model.EventRSVP;
import com.back.demo.model.EventWithDistance;
import com.back.demo.repository.EventRSVPRepository;
import com.back.demo.repository.EventRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.time.ZoneId;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventRSVPRepository eventRSVPRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long eventId) {
        return eventRepository.findById(eventId);
    }

    public List<Event> getEventByHostId(Long hostId) {
        return eventRepository.findAllHostEvents(hostId);
    }

    @CacheEvict(value = "events", key = "'getAllEvents'")
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getEventBySocialClubId(Long socialClubId) {
        return eventRepository.findAllEventsBySocialClub(socialClubId);
    }

    @CacheEvict(value = "events", key = "'getAllEvents'")
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

    @CacheEvict(value = "events", key = "'getAllEvents'")
    public void deleteEvent(Long eventId) {
        eventRepository.deleteById(eventId);
    }

    @CacheEvict(value = "events", key = "'getAllEvents'")
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

    public List<Event> getEventsAttended(Long employeeId) { 
        List<EventRSVP> rsvps = eventRSVPRepository.findByEmployeeIdAndStatus(employeeId, "attending");
        List<Integer> eventIds = rsvps.stream().map(EventRSVP::getEventId).collect(Collectors.toList());
        //conversion of List<Integer> to List<Long> is not possible
        //so we have to convert List<Integer> to List<Long> by iterating over the list
        List<Long> eventIdsLong = eventIds.stream().map(Integer::longValue).collect(Collectors.toList());

        List<Event> events = eventRepository.findAllById(eventIdsLong);

        //If an events startDate variable is after the current date, remove it from the list
        Date currentDate = new Date(System.currentTimeMillis());

        events.removeIf(event -> event.getStartDate().after(currentDate));

        return events;
    }

    public List<Event> getUpcomingEvents(Long employeeId) { 
        List<EventRSVP> rsvps = eventRSVPRepository.findByEmployeeIdAndStatus(employeeId, "attending");
        List<Integer> eventIds = rsvps.stream().map(EventRSVP::getEventId).collect(Collectors.toList());
        //conversion of List<Integer> to List<Long> is not possible
        //so we have to convert List<Integer> to List<Long> by iterating over the list
        List<Long> eventIdsLong = eventIds.stream().map(Integer::longValue).collect(Collectors.toList());

        List<Event> events = eventRepository.findAllById(eventIdsLong);

        //If an events startDate variable is after the current date, remove it from the list
        Date currentDate = new Date(System.currentTimeMillis());

        events.removeIf(event -> event.getStartDate().before(currentDate));

        return events;
    }
    
    public List<Event> getEventsByTitle(String title) {
        return eventRepository.findEventsByTitle(title);
    }

    public List<Event> getAllEventsForUser(Long userId) {
        List<Event> hostedEvents = eventRepository.findAllHostEvents(userId);
        List<Event> attendedEvents = getUpcomingEvents(userId);
        hostedEvents.addAll(attendedEvents);
        return hostedEvents.stream()
                .distinct()
                .collect(Collectors.toList());
    }

    public List<Event> getHostedEvents(Long userId) {
        return eventRepository.findAllHostEvents(userId);
    }
    
    public List<Event> getAttendingEvents(Long userId) {
        return getUpcomingEvents(userId);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    public List<EventWithDistance> getEventsNearUser(double userLat, double userLon, double radiusKm) {
        List<Event> allEvents = eventRepository.findAll();
        return allEvents.stream()
                .map(event -> {
                    String[] geo = event.getGeolocation().split(", ");
                    if (geo.length != 2) {
                        throw new IllegalArgumentException("Invalid geolocation format for event: " + event.getEventId());
                    }
                    double eventLat;
                    double eventLon;
                    try {
                        eventLat = Double.parseDouble(geo[0]);
                        eventLon = Double.parseDouble(geo[1]);
                    } catch (NumberFormatException e) {
                        throw new IllegalArgumentException("Invalid geolocation values for event: " + event.getEventId(), e);
                    }
                    double distance = calculateDistance(userLat, userLon, eventLat, eventLon);
                    return new EventWithDistance(event, distance);
                })
                .filter(eventWithDistance -> eventWithDistance.getDistance() <= radiusKm)
                .collect(Collectors.toList());
    }

    public Event getUpcomingEvent(Long userId) {
        List<Event> hostedEvents = getHostedEvents(userId);
        List<Event> attendedEvents = getUpcomingEvents(userId);
        hostedEvents.addAll(attendedEvents);
    
        Date currentDate = new Date(System.currentTimeMillis());
    
        return hostedEvents.stream()
                .filter(event -> event.getStartDate().after(currentDate) || 
                                 (event.getStartDate().equals(currentDate) && event.getStartTime().after(new Time(System.currentTimeMillis()))))
                .min(Comparator.comparing(Event::getStartDate).thenComparing(Event::getStartTime)) // Find the event with the closest start date and time
                .orElse(null); // Return null if no events are found
    }

    public List<Event> getEventsByDate(LocalDate date) {
        return eventRepository.findAll().stream()
                .filter(event -> event.getStartDate().toLocalDate().equals(date))
                .collect(Collectors.toList());
    }
    
    public List<Event> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.findAll().stream()
                .filter(event -> {
                    LocalDateTime eventStartDate = event.getStartDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                    LocalDateTime eventEndDate = event.getEndDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                    return !eventStartDate.isBefore(startDate) && !eventEndDate.isAfter(endDate);
                })
                .collect(Collectors.toList());
    }
}
