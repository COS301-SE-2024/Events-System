package com.back.demo.servicebus;

import com.back.demo.model.Feedback;
import com.back.demo.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackServiceBusImpl implements FeedbackServiceBus {

    @Autowired
    private FeedbackService feedbackService;

    @Override
    public List<Feedback> getAllFeedback() {
        return feedbackService.getAllFeedback();
    }

    @Override
    public Optional<Feedback> getFeedbackById(Long feedbackId) {
        return feedbackService.getFeedbackById(feedbackId);
    }

    @Override
    public List<Feedback> getFeedbackByEventId(Long eventId) {
        return feedbackService.getFeedbackByEventId(eventId);
    }

    @Override
    public List<Feedback> getFeedbackByEmployeeId(Long employeeId) {
        return feedbackService.getFeedbackByEmployeeId(employeeId);
    }

    @Override
    public Feedback createFeedback(Feedback feedback) {
        return feedbackService.createFeedback(feedback);
    }

    @Override
    public Feedback updateFeedback(Long feedbackId, Feedback feedbackDetails) {
        return feedbackService.updateFeedback(feedbackId, feedbackDetails);
    }

    @Override
    public Feedback patchFeedback(Long feedbackId, Feedback feedbackDetails) {
        return feedbackService.patchFeedback(feedbackId, feedbackDetails);
    }

    @Override
    public void deleteFeedback(Long feedbackId) {
        feedbackService.deleteFeedback(feedbackId);
    }
}
