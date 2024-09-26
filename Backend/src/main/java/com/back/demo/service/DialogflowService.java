package com.back.demo.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.back.demo.model.Event;
import com.back.demo.model.EventRSVP;
import com.back.demo.model.EventWithDistance;
import com.back.demo.model.Feedback;
import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.dialogflow.v2.DetectIntentRequest;
import com.google.cloud.dialogflow.v2.DetectIntentResponse;
import com.google.cloud.dialogflow.v2.QueryInput;
import com.google.cloud.dialogflow.v2.QueryResult;
import com.google.cloud.dialogflow.v2.SessionName;
import com.google.cloud.dialogflow.v2.SessionsClient;
import com.google.cloud.dialogflow.v2.SessionsSettings;
import com.google.cloud.dialogflow.v2.TextInput;

@Service
public class DialogflowService {
    private static final String PROJECT_ID = "events-system-back";
    private static final String RECOMMEND_EVENTS_URL_TEMPLATE = "https://capstone-middleware-178c57c6a187.herokuapp.com/recommend?user_id=%d";

    @Autowired
    private EventService eventService;

    @Autowired
    private EventRSVPService eventRSVPService;

    @Autowired
    private FeedbackService feedbackService;
    
    @Autowired
    private EmployeeService employeeService;

    @Value("${google.application.credentials.json}")
    private String googleCredentialsJson;

    public String detectIntentTexts(String text, String sessionId, int userID) throws IOException {
        // Create GoogleCredentials from JSON content
        InputStream credentialsStream = new ByteArrayInputStream(googleCredentialsJson.getBytes());
        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream);

        // Create SessionsClient with the provided credentials
        SessionsSettings sessionsSettings = SessionsSettings.newBuilder()
                .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                .build();

        try(SessionsClient sessionsClient = SessionsClient.create(sessionsSettings)){
            SessionName session = SessionName.of(PROJECT_ID, sessionId);
            TextInput.Builder textInput = TextInput.newBuilder().setText(text).setLanguageCode("en-US");
            QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();
    
            DetectIntentRequest request = DetectIntentRequest.newBuilder()
                    .setSession(session.toString())
                    .setQueryInput(queryInput)
                    .build();
            // Perform the detectIntent request
            DetectIntentResponse response = sessionsClient.detectIntent(request);
            QueryResult queryResult = response.getQueryResult();
            
            //event recommender intent
            if(queryResult.getIntent().getDisplayName().equals("Recommend Events")) {
                List<Event> recommendedEvents = getRecommendedEvents(userID);
                String eventsString = recommendedEvents.stream()
                    .map(this::formatEventDetails)
                    .collect(Collectors.joining("\n"));
                return queryResult.getFulfillmentText() + "\n" + eventsString;
            }
    
            //event details intent
            if (queryResult.getIntent().getDisplayName().equals("Event details")) {
                String eventTitle = queryResult.getParameters().getFieldsMap().get("eventtitle") != null
                        ? queryResult.getParameters().getFieldsMap().get("eventtitle").getStringValue()
                        : "Unknown Event";
                System.out.println(eventTitle);
                
                List<Event> events = eventService.getEventsByTitle(eventTitle);
                Event mostRecentEvent = events.stream()
                        .max(Comparator.comparing(Event::getCreatedAt))
                        .orElse(null);
                
                String eventString = mostRecentEvent != null
                        ? formatEventDetails(mostRecentEvent)
                        : "No events found.";
                
                System.out.println(eventString);
                return queryResult.getFulfillmentText() + "\n" + eventString;
            }
    
            // RSVP from event details intent
            if (queryResult.getIntent().getDisplayName().equals("RSVP from event details")) {
                String eventTitle = queryResult.getParameters().getFieldsMap().get("eventtitle") != null
                        ? queryResult.getParameters().getFieldsMap().get("eventtitle").getStringValue()
                        : "Unknown Event";
                System.out.println(eventTitle);
                
                List<Event> events = eventService.getEventsByTitle(eventTitle);
                Event mostRecentEvent = events.stream()
                        .max(Comparator.comparing(Event::getCreatedAt))
                        .orElse(null);
                
                String eventString = mostRecentEvent != null
                        ? formatEventDetails(mostRecentEvent)
                        : "No events found.";
                
                Long eventID = mostRecentEvent != null ? mostRecentEvent.getEventId() : null;
    
                if(eventID != null && eventRSVPService.userHasRSVPForEvent(userID, eventID.intValue())){
                    return "Oops, looks like you've already RSVP'd for the event";
                }
                if (eventID != null && !eventRSVPService.userHasRSVPForEvent(userID, eventID.intValue())) {
                    EventRSVP eventRSVP = new EventRSVP();
                    eventRSVP.setEmployeeId(userID);
                    eventRSVP.setEventId(eventID.intValue());
                    eventRSVP.setStatus("Booked");
                    eventRSVPService.createEventRSVP(eventRSVP);
                }
                
                System.out.println(eventString);
                return queryResult.getFulfillmentText();
            }
            
    
            // unRSVP from event details intent
            if (queryResult.getIntent().getDisplayName().equals("unRSVP from event details")) {
                String eventTitle = queryResult.getParameters().getFieldsMap().get("eventtitle") != null
                        ? queryResult.getParameters().getFieldsMap().get("eventtitle").getStringValue()
                        : "Unknown Event";
                System.out.println(eventTitle);
                
                List<Event> events = eventService.getEventsByTitle(eventTitle);
                Event mostRecentEvent = events.stream()
                        .max(Comparator.comparing(Event::getCreatedAt))
                        .orElse(null);
            
                
                Long eventID = mostRecentEvent != null ? mostRecentEvent.getEventId() : null;
    
                if (eventID != null && eventRSVPService.userHasRSVPForEvent(userID, eventID.intValue())) {
                    eventRSVPService.removeRSVPForEvent(userID, eventID.intValue());
                    return queryResult.getFulfillmentText();
                } else {
                    return "You do not have an RSVP for this event.";
                }
            }
    
            // set feedback for an event
            if (queryResult.getIntent().getDisplayName().equals("Rating-init - Select - rank")) {
                String eventTitle = queryResult.getParameters().getFieldsMap().get("eventtitle") != null
                        ? queryResult.getParameters().getFieldsMap().get("eventtitle").getStringValue()
                        : "Unknown Event";
                System.out.println(eventTitle);
                
                List<Event> events = eventService.getEventsByTitle(eventTitle);
                Event mostRecentEvent = events.stream()
                        .max(Comparator.comparing(Event::getCreatedAt))
                        .orElse(null);
                
                Long eventID = mostRecentEvent != null ? mostRecentEvent.getEventId() : null;
                if (eventID != null && eventRSVPService.userHasRSVPForEvent(userID, eventID.intValue())) {
                // Extract rating and comment parameters
                double ratingDouble = queryResult.getParameters().getFieldsMap().get("rating") != null
                        ? queryResult.getParameters().getFieldsMap().get("rating").getNumberValue()
                        : -1.0;
                int rating = (int) ratingDouble;
                String comment = queryResult.getParameters().getFieldsMap().get("comment") != null
                        ? queryResult.getParameters().getFieldsMap().get("comment").getStringValue()
                        : "";

                // Check if comment is missing or empty
                if (comment.isEmpty()) {
                    return queryResult.getFulfillmentText();
                }
                comment = sanitizeInput(comment);
                // Validate rating
                if (rating < 0 || rating > 5) {
                    return "Invalid rating. Please enter a rating between 0 and 5.";
                }

                // Store feedback
                Feedback feedback = new Feedback();
                feedback.setEventId(eventID);
                feedback.setEmployeeId((long) userID);
                feedback.setRating(rating);
                feedback.setComments(comment);
                feedbackService.createFeedback(feedback);

                return queryResult.getFulfillmentText();
                } else {
                    return "Oh no, it appears you aren't RSVP'd for this event. Please RSVP before providing feedback.";
                }
    
            }


            //Get all scheduled events for the user
            if (queryResult.getIntent().getDisplayName().equals("Event Schedule Init - All")) {
            List<Event> upcomingEvents = eventService.getAllEventsForUser((long) userID);

            // Sort events in chronological order
            upcomingEvents.sort(Comparator.comparing(Event::getStartDate).thenComparing(Event::getStartTime));

            // Format the events to include only title and start date
            StringBuilder eventsStringBuilder = new StringBuilder("Your upcoming events:\n");
            for (Event event : upcomingEvents) {
                eventsStringBuilder.append(formatEventDetails(event)).append("\n");
            }

            return queryResult.getFulfillmentText() + eventsStringBuilder.toString();
        }

            //Get all scheduled events the user is hosting
            if (queryResult.getIntent().getDisplayName().equals("Event Schedule Init - Hosting")) {
                List<Event> hostedEvents = eventService.getHostedEvents((long) userID);
    
                // Sort events in chronological order
                hostedEvents.sort(Comparator.comparing(Event::getStartDate).thenComparing(Event::getStartTime));
    
                // Format the events to include only title and start date
                StringBuilder eventsStringBuilder = new StringBuilder("Your hosted events:\n");
                for (Event event : hostedEvents) {
                    eventsStringBuilder.append(formatEventDetails(event)).append("\n");
                }
    
                return queryResult.getFulfillmentText() + eventsStringBuilder.toString();
            }

            //Get all scheduled events the user is Attending
            if (queryResult.getIntent().getDisplayName().equals("Event Schedule Init - Attending")) {
                List<Event> attendingEvents = eventService.getAttendingEvents((long) userID);
    
                // Sort events in chronological order
                attendingEvents.sort(Comparator.comparing(Event::getStartDate).thenComparing(Event::getStartTime));
    
                // Format the events to include only title and start date
                StringBuilder eventsStringBuilder = new StringBuilder("Your attending events:\n");
                for (Event event : attendingEvents) {
                    eventsStringBuilder.append(formatEventDetails(event)).append("\n");
                }
    
                return queryResult.getFulfillmentText() + eventsStringBuilder.toString();
            }

            // Handle the "Event search date" intent
            if (queryResult.getIntent().getDisplayName().equals("Event search date")) {
                String dateTimeParam = queryResult.getParameters().getFieldsMap().get("date-time") != null
                        ? queryResult.getParameters().getFieldsMap().get("date-time").getStringValue()
                        : null;

                List<Event> events = null;

                if (dateTimeParam != null && dateTimeParam.length() >= 10) {
                    // Handle date-time as a single date
                    LocalDate date = LocalDate.parse(dateTimeParam.substring(0, 10)); // Extract date part
                    events = eventService.getEventsByDate(date);
                } else {
                    // Handle the case where dateTimeParam is null or too short
                    throw new IllegalArgumentException("Invalid date-time parameter");
                }

                if (events != null && !events.isEmpty()) {
                    String eventsString = events.stream()
                            .map(this::formatEventDetails)
                            .reduce((a, b) -> a + "\n" + b)
                            .orElse("No events found.");
                    return queryResult.getFulfillmentText() + "\n" + eventsString;
                } else {
                    return queryResult.getFulfillmentText() + "\nNo events found.";
                }
            }
                    
            //event details get host email
            if (queryResult.getIntent().getDisplayName().equals("Event details contact")) {
                String eventTitle = queryResult.getParameters().getFieldsMap().get("eventtitle") != null
                        ? queryResult.getParameters().getFieldsMap().get("eventtitle").getStringValue()
                        : "Unknown Event";
                System.out.println(eventTitle);
                
                List<Event> events = eventService.getEventsByTitle(eventTitle);
                Event mostRecentEvent = events.stream()
                        .max(Comparator.comparing(Event::getCreatedAt))
                        .orElse(null);
                
                Integer hID = mostRecentEvent != null ? mostRecentEvent.getHostId() : null;
                String hostEmail = hID != null ? employeeService.getEmployeeEmailById(hID.longValue()) : "Host email not found";

                String eventString = mostRecentEvent != null ? hostEmail : "No events found.";
                
                System.out.println(eventString);
                return queryResult.getFulfillmentText() + "\n" + eventString;
            }
            
            // RSVP intent
            if (queryResult.getIntent().getDisplayName().equals("Event RSVP")) {
                String eventTitle = queryResult.getParameters().getFieldsMap().get("eventtitle") != null
                        ? queryResult.getParameters().getFieldsMap().get("eventtitle").getStringValue()
                        : "Unknown Event";
                System.out.println(eventTitle);
                
                List<Event> events = eventService.getEventsByTitle(eventTitle);
                Event mostRecentEvent = events.stream()
                        .max(Comparator.comparing(Event::getCreatedAt))
                        .orElse(null);
                
                String eventString = mostRecentEvent != null
                        ? formatEventDetails(mostRecentEvent)
                        : "No events found.";
                
                Long eventID = mostRecentEvent != null ? mostRecentEvent.getEventId() : null;
    
                if(eventID != null && eventRSVPService.userHasRSVPForEvent(userID, eventID.intValue())){
                    return "Oops, looks like you've already RSVP'd for the event";
                }
                if (eventID != null && !eventRSVPService.userHasRSVPForEvent(userID, eventID.intValue())) {
                    EventRSVP eventRSVP = new EventRSVP();
                    eventRSVP.setEmployeeId(userID);
                    eventRSVP.setEventId(eventID.intValue());
                    eventRSVP.setStatus("Booked");
                    eventRSVPService.createEventRSVP(eventRSVP);
                }
                
                System.out.println(eventString);
                return queryResult.getFulfillmentText();
            }
            
            // unRSVP intent
            if (queryResult.getIntent().getDisplayName().equals("Event unRSVP")) {
                String eventTitle = queryResult.getParameters().getFieldsMap().get("eventtitle") != null
                        ? queryResult.getParameters().getFieldsMap().get("eventtitle").getStringValue()
                        : "Unknown Event";
                System.out.println(eventTitle);
                
                List<Event> events = eventService.getEventsByTitle(eventTitle);
                Event mostRecentEvent = events.stream()
                        .max(Comparator.comparing(Event::getCreatedAt))
                        .orElse(null);
            
                
                Long eventID = mostRecentEvent != null ? mostRecentEvent.getEventId() : null;
    
                if (eventID != null && eventRSVPService.userHasRSVPForEvent(userID, eventID.intValue())) {
                    eventRSVPService.removeRSVPForEvent(userID, eventID.intValue());
                    return queryResult.getFulfillmentText();
                } else {
                    return "You do not have an RSVP for this event.";
                }
            }
            
            // Handle the "Upcoming Event" intent
            if (queryResult.getIntent().getDisplayName().equals("Upcoming event")) {
                Event upcomingEvent = eventService.getUpcomingEvent((long) userID);
                String eventString = upcomingEvent != null
                        ? formatEventDetails(upcomingEvent)
                        : "No upcoming events found.";
                return queryResult.getFulfillmentText() + eventString;
            }
            
            // Handle the "Event location" intent
            if (queryResult.getIntent().getDisplayName().equals("Event location")) {
                String eventTitle = queryResult.getParameters().getFieldsMap().get("eventtitle") != null
                        ? queryResult.getParameters().getFieldsMap().get("eventtitle").getStringValue()
                        : "Unknown Event";
                List<Event> events = eventService.getEventsByTitle(eventTitle);
                if (events.isEmpty()) {
                    return "No events found with the title: " + eventTitle;
                }

                Event mostRecentEvent = events.stream()
                .max(Comparator.comparing(Event::getCreatedAt))
                .orElse(null);

                String location = mostRecentEvent != null ? mostRecentEvent.getLocation() : "Location not found";

                
                return queryResult.getFulfillmentText() + location;
            }
            
            // Handle the "Event start time" intent
            if (queryResult.getIntent().getDisplayName().equals("Event Start time")) {
                String eventTitle = queryResult.getParameters().getFieldsMap().get("eventtitle") != null
                        ? queryResult.getParameters().getFieldsMap().get("eventtitle").getStringValue()
                        : "Unknown Event";
                List<Event> events = eventService.getEventsByTitle(eventTitle);
                if (events.isEmpty()) {
                    return "No events found with the title: " + eventTitle;
                }

                Event mostRecentEvent = events.stream()
                        .max(Comparator.comparing(Event::getCreatedAt))
                        .orElse(null);

                String time = "Time not found";
                if (mostRecentEvent != null && mostRecentEvent.getStartTime() != null) {
                    // Convert Time to String
                    String startTimeString = mostRecentEvent.getStartTime().toString();
                    // Parse the String to LocalTime
                    LocalTime startTime = LocalTime.parse(startTimeString);
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");
                    time = startTime.format(formatter);
                }

                return queryResult.getFulfillmentText() + time;
            }
            
            // Handle the "Event end time" intent
            if (queryResult.getIntent().getDisplayName().equals("Event End time")) {
                String eventTitle = queryResult.getParameters().getFieldsMap().get("eventtitle") != null
                        ? queryResult.getParameters().getFieldsMap().get("eventtitle").getStringValue()
                        : "Unknown Event";
                List<Event> events = eventService.getEventsByTitle(eventTitle);
                if (events.isEmpty()) {
                    return "No events found with the title: " + eventTitle;
                }

                Event mostRecentEvent = events.stream()
                        .max(Comparator.comparing(Event::getCreatedAt))
                        .orElse(null);

                String time = "Time not found";
                if (mostRecentEvent != null && mostRecentEvent.getEndTime() != null) {
                    // Convert Time to String
                    String endTimeString = mostRecentEvent.getEndTime().toString();
                    // Parse the String to LocalTime
                    LocalTime endTime = LocalTime.parse(endTimeString);
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a");
                    time = endTime.format(formatter);
                }

                return queryResult.getFulfillmentText() + time;
            }
            
            // Handle the "Event start date" intent
            if (queryResult.getIntent().getDisplayName().equals("Event Start Date")) {
                String eventTitle = queryResult.getParameters().getFieldsMap().get("eventtitle") != null
                        ? queryResult.getParameters().getFieldsMap().get("eventtitle").getStringValue()
                        : "Unknown Event";
                List<Event> events = eventService.getEventsByTitle(eventTitle);
                if (events.isEmpty()) {
                    return "No events found with the title: " + eventTitle;
                }

                Event mostRecentEvent = events.stream()
                        .max(Comparator.comparing(Event::getCreatedAt))
                        .orElse(null);

                String date = "Date not found";
                if (mostRecentEvent != null && mostRecentEvent.getStartDate() != null) {
                    // Convert String to LocalDate
                    LocalDate startDate = LocalDate.parse(mostRecentEvent.getStartDate().toString());
                    // Format the LocalDate to the desired format
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d'th' 'of' MMM");
                    date = startDate.format(formatter);

                    // Replace the suffix based on the day of the month
                    int day = startDate.getDayOfMonth();
                    if (day == 1 || day == 21 || day == 31) {
                        date = date.replace("th", "st");
                    } else if (day == 2 || day == 22) {
                        date = date.replace("th", "nd");
                    } else if (day == 3 || day == 23) {
                        date = date.replace("th", "rd");
                    }
                }

                return queryResult.getFulfillmentText() + date;
            }
            
            // Handle the "Event end date" intent
            if (queryResult.getIntent().getDisplayName().equals("Event End Date")) {
                String eventTitle = queryResult.getParameters().getFieldsMap().get("eventtitle") != null
                        ? queryResult.getParameters().getFieldsMap().get("eventtitle").getStringValue()
                        : "Unknown Event";
                List<Event> events = eventService.getEventsByTitle(eventTitle);
                if (events.isEmpty()) {
                    return "No events found with the title: " + eventTitle;
                }

                Event mostRecentEvent = events.stream()
                        .max(Comparator.comparing(Event::getCreatedAt))
                        .orElse(null);

                String date = "Date not found";
                if (mostRecentEvent != null && mostRecentEvent.getEndDate() != null) {
                    // Convert String to LocalDate
                    LocalDate endDate = LocalDate.parse(mostRecentEvent.getEndDate().toString());
                    // Format the LocalDate to the desired format
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d'th' 'of' MMM");
                    date = endDate.format(formatter);

                    // Replace the suffix based on the day of the month
                    int day = endDate.getDayOfMonth();
                    if (day == 1 || day == 21 || day == 31) {
                        date = date.replace("th", "st");
                    } else if (day == 2 || day == 22) {
                        date = date.replace("th", "nd");
                    } else if (day == 3 || day == 23) {
                        date = date.replace("th", "rd");
                    }
                }

                return queryResult.getFulfillmentText() + date;
            }
            
            // Handle the "Event Preparation details" intent
            if (queryResult.getIntent().getDisplayName().equals("Event Preperation Details")) {
                String eventTitle = queryResult.getParameters().getFieldsMap().get("eventtitle") != null
                        ? queryResult.getParameters().getFieldsMap().get("eventtitle").getStringValue()
                        : "Unknown Event";
                List<Event> events = eventService.getEventsByTitle(eventTitle);
                if (events.isEmpty()) {
                    return "No events found with the title: " + eventTitle;
                }

                Event mostRecentEvent = events.stream()
                        .max(Comparator.comparing(Event::getCreatedAt))
                        .orElse(null);

                if (mostRecentEvent != null && mostRecentEvent.getEventPreparation() != null) {
                    String[] preparationDetails = mostRecentEvent.getEventPreparation();
                    String formattedDetails = String.join("\n- ", preparationDetails);
                    return queryResult.getFulfillmentText() + "\n" + formattedDetails;
                } else {
                    return "No preparation details found for the event: " + eventTitle;
                }
            }

            // Handle the "Event Agenda details" intent
            if (queryResult.getIntent().getDisplayName().equals("Event Agenda Details")) {
                String eventTitle = queryResult.getParameters().getFieldsMap().get("eventtitle") != null
                        ? queryResult.getParameters().getFieldsMap().get("eventtitle").getStringValue()
                        : "Unknown Event";
                List<Event> events = eventService.getEventsByTitle(eventTitle);
                if (events.isEmpty()) {
                    return "No events found with the title: " + eventTitle;
                }

                Event mostRecentEvent = events.stream()
                        .max(Comparator.comparing(Event::getCreatedAt))
                        .orElse(null);

                if (mostRecentEvent != null && mostRecentEvent.getEventAgendas() != null) {
                    String[] agendaDetails = mostRecentEvent.getEventAgendas();
                    String formattedDetails = String.join("\n- ", agendaDetails);
                    return queryResult.getFulfillmentText() + "\n" + formattedDetails;
                } else {
                    return "No preparation details found for the event: " + eventTitle;
                }
            }
            
                    // Handle the "Help" intent
            if (queryResult.getIntent().getDisplayName().equals("Help")) {
                String helpMessage = "Here are the things I can help you with:\n" +
                        "1. I can Recommend Events ( try: \"Recommend some events\")\n" +
                        "2. I can give you Event Details ( try: \" tell me about [event-name]\" )\n" +
                        "3. I can RSVP from Event Details ( try: \" tell me about [event-name]\" and then \"rsvp for it\")'\n" +
                        "4. I can unRSVP from Event Details ( try: \" tell me about [event-name]\" and then \"unrsvp for it\")'\n" +
                        "5. I can Set Feedback for an Event ( try: \" Set a rating \" ) \n" +
                        "6. I can Get All your Scheduled Events: ( try: \" I want to see my schedule\" and then \"all of them\")'\n" +
                        "7. I can Get All your Hosted Events: ( try: \" I want to see my schedule\" and then \"Hosting\")'\n" +
                        "8. I can Get All your Attending Events: ( try: \" I want to see my schedule\" and then \"Attending\")'\n" +
                        "9. I can Search Events by Date: ( try: \" what events are listed for tomorrow \" )'\n" +
                        "10. I can Get Host Email from Event Details: '( try: \" tell me about [event-name]\" and then \"How do i contact the host?\")''\n" +
                        "11. I can RSVP to an Event: ( try: \" RSVP to [event-name] \" )'\n" +
                        "12. I can UnRSVP from an Event: ( try: \" cancel my RSVP to [event-name] \" )'\n" +
                        "13. I can Get Upcoming Event: ( try: \" what's my next event \" )'\n" +
                        "14. I can Get Event Location: ( try: \" where is [event-name] happening \" )'\n" +
                        "15. I can Get Event Start Time: ( try: \" what time does[event-name] start \" )'\n" +
                        "16. I can Get Event End Time: ( try: \" what time does[event-name] end \" )'\n" +
                        "17. I can Get Event Start Date: ( try: \" when does [event-name] start \" )'\n" +
                        "18. I can Get Event End Date: ( try: \" what time does [event-name] end \" )'\n" +
                        "19. I can Get Event Preparation Details: ( try: \" how do i prepare for [event-name] \" )'\n" +
                        "20. I can Get Event Agenda Details: ( try: \" what's on the agenda for [event-name] \" )\n" +
                        "21. I can provide you with a list of nearby events: ( try: \" what events are happening near me? \" )\n";

                return helpMessage;
            }
            return queryResult.getFulfillmentText();
        }
    }

    public String localdetectIntentTexts(String text, String sessionId, int userID, Double longitude, Double latitude) throws IOException {
        // Create GoogleCredentials from JSON content
        InputStream credentialsStream = new ByteArrayInputStream(googleCredentialsJson.getBytes());
        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream);
    
        // Create SessionsClient with the provided credentials
        SessionsSettings sessionsSettings = SessionsSettings.newBuilder()
                .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                .build();
    
        try (SessionsClient sessionsClient = SessionsClient.create(sessionsSettings)) {
            SessionName session = SessionName.of(PROJECT_ID, sessionId);
            TextInput.Builder textInput = TextInput.newBuilder().setText(text).setLanguageCode("en-US");
            QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();
    
            DetectIntentRequest request = DetectIntentRequest.newBuilder()
                    .setSession(session.toString())
                    .setQueryInput(queryInput)
                    .build();
    
            // Perform the detectIntent request
            DetectIntentResponse response = sessionsClient.detectIntent(request);
            QueryResult queryResult = response.getQueryResult();
    
            // Handle intents
            if (queryResult.getIntent().getDisplayName().equals("Near Me")) {
                double radiusKm = 30.0; // Define the radius in kilometers
                List<EventWithDistance> nearbyEvents = eventService.getEventsNearUser(longitude, latitude, radiusKm);

                // Format the response
                StringBuilder eventsStringBuilder = new StringBuilder("Nearby events:\n");
                for (EventWithDistance eventWithDistance : nearbyEvents) {
                    eventsStringBuilder.append(formatEventDetailswithDistance(eventWithDistance.getEvent(), eventWithDistance.getDistance())).append("\n");
                }

                return queryResult.getFulfillmentText() + "\n" + eventsStringBuilder.toString();
            }
    
            return queryResult.getFulfillmentText();
        }
    }

    private String formatEventDetails(Event event) {
        String eventId = event.getEventId() != null ? event.getEventId().toString() : "";
        String title = event.getTitle() != null ? event.getTitle() : "";
        String location = event.getLocation() != null ? event.getLocation() : "";
        String startDate = event.getStartDate() != null ? event.getStartDate().toString() : "";
        String startTime = event.getStartTime() != null ? event.getStartTime().toString() : "";
    
        return String.format("ID: %s, Title: %s, Location: %s, Start Date: %s, Start Time: %s", eventId, title, location, startDate, startTime);
    }
    
    private String formatEventDetailswithDistance(Event event, Double distance) {
        String eventId = event.getEventId() != null ? event.getEventId().toString() : "";
        String distanceStr = distance != null ? String.format(" (%.2f km away)", distance) : "";
        String title = event.getTitle() != null ? event.getTitle() + distanceStr : "";
        String location = event.getLocation() != null ? event.getLocation() : "";
        String startDate = event.getStartDate() != null ? event.getStartDate().toString() : "";
        String startTime = event.getStartTime() != null ? event.getStartTime().toString() : "";
    
        return String.format("ID: %s, Title: %s, Location: %s, Start Date: %s, Start Time: %s", eventId, title, location, startDate, startTime);
    }

    public List<Event> getRecommendedEvents(int userID) {
        String url = String.format(RECOMMEND_EVENTS_URL_TEMPLATE, userID);
        RestTemplate restTemplate = new RestTemplate();
        Double[] response = restTemplate.getForObject(url, Double[].class);
        List<Double> eventIds = Arrays.asList(response);
    
        // Fetch event details for each event ID and handle Optional<Event>
        List<Event> events = eventIds.stream()
            .map(eventId -> eventService.getEventById(eventId.longValue()))
            .flatMap(Optional::stream) // Filter out empty Optional values
            .collect(Collectors.toList());
    
        return events;
    }

    // Method to sanitize input
    private String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }

        // Remove HTML tags
        input = input.replaceAll("<[^>]*>", "");

        // Escape special characters
        input = input.replace("&", "");
        input = input.replace("<", "");
        input = input.replace(">", "");
        input = input.replace("\"", "");
        input = input.replace("'", "");
        input = input.replace("/", "");

        // Remove SQL keywords
        input = input.replaceAll("(?i)select\\b|insert\\b|update\\b|delete\\b|drop\\b|--", "");

        return input;
    }
}