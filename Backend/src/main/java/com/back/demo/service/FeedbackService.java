package com.back.demo.service;

import com.back.demo.model.Feedback;
import com.back.demo.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    public Optional<Feedback> getFeedbackById(Long feedbackId) {
        return feedbackRepository.findById(feedbackId);
    }

    public List<Feedback> getFeedbackByEventId(Long eventId) {
        return feedbackRepository.findByEventId(eventId);
    }

    public List<Feedback> getFeedbackByEmployeeId(Long employeeId) {
        return feedbackRepository.findByEmployeeId(employeeId);
    }

    public Feedback createFeedback(Feedback feedback) {
        // Ensure createdAt is set
        if (feedback.getCreatedAt() == null) {
            feedback.setCreatedAt(LocalDateTime.now());
        }
        return feedbackRepository.save(feedback);
    }

    public Feedback updateFeedback(Long feedbackId, Feedback feedbackDetails) {
        Optional<Feedback> optionalFeedback = feedbackRepository.findById(feedbackId);
        if (optionalFeedback.isPresent()) {
            Feedback feedback = optionalFeedback.get();
            feedback.setEventId(feedbackDetails.getEventId());
            feedback.setEmployeeId(feedbackDetails.getEmployeeId());
            feedback.setRating(feedbackDetails.getRating());
            feedback.setComments(feedbackDetails.getComments());
            return feedbackRepository.save(feedback);
        } else {
            throw new RuntimeException("Feedback not found with id " + feedbackId);
        }
    }

    public Feedback patchFeedback(Long feedbackId, Feedback feedbackDetails) {
        Optional<Feedback> optionalFeedback = feedbackRepository.findById(feedbackId);
        if (optionalFeedback.isPresent()) {
            Feedback feedback = optionalFeedback.get();
            if (feedbackDetails.getEventId() != null) {
                feedback.setEventId(feedbackDetails.getEventId());
            }
            if (feedbackDetails.getEmployeeId() != null) {
                feedback.setEmployeeId(feedbackDetails.getEmployeeId());
            }
            if (feedbackDetails.getRating() != null) {
                feedback.setRating(feedbackDetails.getRating());
            }
            if (feedbackDetails.getComments() != null) {
                feedback.setComments(feedbackDetails.getComments());
            }
            return feedbackRepository.save(feedback);
        } else {
            throw new RuntimeException("Feedback not found with id " + feedbackId);
        }
    }

    public void deleteFeedback(Long feedbackId) {
        feedbackRepository.deleteById(feedbackId);
    }
}
