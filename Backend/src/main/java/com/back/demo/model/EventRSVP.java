package com.back.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.sql.Timestamp;

@Entity
@Table(name = "EventRSVPs")
public class EventRSVP {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rsvp_id")
    private Long rsvpId;

    @Column(name = "event_id", nullable = false)
    private Integer eventId;

    @Column(name = "employee_id", nullable = false)
    private Integer employeeId;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "rsvp_at", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private Timestamp rsvpAt;

    // Getters and Setters
    public Long getRsvpId() {
        return rsvpId;
    }

    public void setRsvpId(Long rsvpId) {
        this.rsvpId = rsvpId;
    }

    public Integer getEventId() {
        return eventId;
    }

    public void setEventId(Integer eventId) {
        this.eventId = eventId;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getRsvpAt() {
        return rsvpAt;
    }

    public void setRsvpAt(Timestamp rsvpAt) {
        this.rsvpAt = rsvpAt;
    }
}
