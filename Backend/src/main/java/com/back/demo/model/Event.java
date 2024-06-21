package com.back.demo.model;

import jakarta.persistence.*;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "start_time", nullable = false)
    private Time startTime;

    @Column(name = "end_time", nullable = false)
    private Time endTime;

    @Column(name = "start_date", nullable = false)
    private Date startDate;

    @Column(name = "end_date", nullable = false)
    private Date endDate;

    @Column(name = "location")
    private String location;

    @Column(name = "host_id", nullable = false)
    private Integer hostId;

    @Column(name = "geolocation")
    private String geolocation;

    @Column(name = "social_club")
    private Integer socialClub;

    @Column(name = "event_picture_link")
    private String eventPictureLink;

    @Column(name = "event_agendas", columnDefinition = "TEXT[]")
    private String[] eventAgendas;

    @Column(name = "event_preparation", columnDefinition = "TEXT[]")
    private String[] eventPreparation;

    @Column(name = "event_dietary_accommodations", columnDefinition = "TEXT[]")
    private String[] eventDietaryAccommodations;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp updatedAt;

    // Getters and Setters
    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Time getStartTime() {
        return startTime;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getHostId() {
        return hostId;
    }

    public void setHostId(Integer hostId) {
        this.hostId = hostId;
    }

    public String getGeolocation() {
        return geolocation;
    }

    public void setGeolocation(String geolocation) {
        this.geolocation = geolocation;
    }

    public Integer getSocialClub() {
        return socialClub;
    }

    public void setSocialClub(Integer socialClub) {
        this.socialClub = socialClub;
    }

    public String getEventPictureLink() {
        return eventPictureLink;
    }

    public void setEventPictureLink(String eventPictureLink) {
        this.eventPictureLink = eventPictureLink;
    }

    public String[] getEventAgendas() {
        return eventAgendas;
    }

    public void setEventAgendas(String[] eventAgendas) {
        this.eventAgendas = eventAgendas;
    }

    public String[] getEventPreparation() {
        return eventPreparation;
    }

    public void setEventPreparation(String[] eventPreparation) {
        this.eventPreparation = eventPreparation;
    }

    public String[] getEventDietaryAccommodations() {
        return eventDietaryAccommodations;
    }

    public void setEventDietaryAccommodations(String[] eventDietaryAccommodations) {
        this.eventDietaryAccommodations = eventDietaryAccommodations;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}
