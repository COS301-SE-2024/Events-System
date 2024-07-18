package com.back.demo.controller;

import com.back.demo.model.Feedback;
import com.back.demo.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable(value = "id") Long feedbackId) {
        Optional<Feedback> feedback = feedbackService.getFeedbackById(feedbackId);
        return feedback.map(ResponseEntity::ok)
                       .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/event/{eventId}")
    public List<Feedback> getFeedbackByEventId(@PathVariable(value = "eventId") Long eventId) {
        return feedbackService.getFeedbackByEventId(eventId);
    }

    @GetMapping("/employee/{employeeId}")
    public List<Feedback> getFeedbackByEmployeeId(@PathVariable(value = "employeeId") Long employeeId) {
        return feedbackService.getFeedbackByEmployeeId(employeeId);
    }

    @PostMapping
    public Feedback createFeedback(@RequestBody Feedback feedback) {
        return feedbackService.createFeedback(feedback);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable(value = "id") Long feedbackId,
                                                   @RequestBody Feedback feedbackDetails) {
        try {
            Feedback updatedFeedback = feedbackService.updateFeedback(feedbackId, feedbackDetails);
            return ResponseEntity.ok(updatedFeedback);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Feedback> patchFeedback(@PathVariable(value = "id") Long feedbackId,
                                                  @RequestBody Feedback feedbackDetails) {
        try {
            Feedback patchedFeedback = feedbackService.patchFeedback(feedbackId, feedbackDetails);
            return ResponseEntity.ok(patchedFeedback);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable(value = "id") Long feedbackId) {
        try {
            feedbackService.deleteFeedback(feedbackId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
