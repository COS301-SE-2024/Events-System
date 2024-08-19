package com.back.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analytics")
public class Analytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer analyticsId;

    @Column(name = "employee_id")
    private Integer employeeId;

    @Column(name = "recorded_at", nullable = false, updatable = false)
    private LocalDateTime recordedAt;

    @Column(name = "event_or_series_booking_clicks", nullable = false)
    private Integer eventOrSeriesBookingClicks = 0;

    @Column(name = "event_or_series_cancel_clicks", nullable = false)
    private Integer eventOrSeriesCancelClicks = 0;

    @Column(name = "other_employee_profile_visits", nullable = false)
    private Integer otherEmployeeProfileVisits = 0;

    @Column(name = "ratings_made", nullable = false)
    private Integer ratingsMade = 0;

    @Column(name = "ratings_received", nullable = false)
    private Integer ratingsReceived = 0;

    @Column(name = "average_event_rating", nullable = false)
    private Double averageEventRating = 0.0;

    @Column(name = "events_hosted", nullable = false)
    private Integer eventsHosted = 0;

    @Column(name = "series_hosted", nullable = false)
    private Integer seriesHosted = 0;

    // Getters and Setters
    public Integer getAnalyticsId() {
        return analyticsId;
    }

    public void setAnalyticsId(Integer analyticsId) {
        this.analyticsId = analyticsId;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }

    public Integer getEventOrSeriesBookingClicks() {
        return eventOrSeriesBookingClicks;
    }

    public void setEventOrSeriesBookingClicks(Integer eventOrSeriesBookingClicks) {
        this.eventOrSeriesBookingClicks = eventOrSeriesBookingClicks;
    }

    public Integer getEventOrSeriesCancelClicks() {
        return eventOrSeriesCancelClicks;
    }

    public void setEventOrSeriesCancelClicks(Integer eventOrSeriesCancelClicks) {
        this.eventOrSeriesCancelClicks = eventOrSeriesCancelClicks;
    }

    public Integer getOtherEmployeeProfileVisits() {
        return otherEmployeeProfileVisits;
    }

    public void setOtherEmployeeProfileVisits(Integer otherEmployeeProfileVisits) {
        this.otherEmployeeProfileVisits = otherEmployeeProfileVisits;
    }

    public Integer getRatingsMade() {
        return ratingsMade;
    }

    public void setRatingsMade(Integer ratingsMade) {
        this.ratingsMade = ratingsMade;
    }

    public Integer getRatingsReceived() {
        return ratingsReceived;
    }

    public void setRatingsReceived(Integer ratingsReceived) {
        this.ratingsReceived = ratingsReceived;
    }

    public Double getAverageEventRating() {
        return averageEventRating;
    }

    public void setAverageEventRating(Double averageEventRating) {
        this.averageEventRating = averageEventRating;
    }

    public Integer getEventsHosted() {
        return eventsHosted;
    }

    public void setEventsHosted(Integer eventsHosted) {
        this.eventsHosted = eventsHosted;
    }

    public Integer getSeriesHosted() {
        return seriesHosted;
    }

    public void setSeriesHosted(Integer seriesHosted) {
        this.seriesHosted = seriesHosted;
    }
}
