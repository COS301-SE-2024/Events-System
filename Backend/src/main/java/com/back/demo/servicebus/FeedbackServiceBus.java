package com.back.demo.servicebus;

import com.back.demo.model.Feedback;

import java.util.List;
import java.util.Optional;

public interface FeedbackServiceBus {
    List<Feedback> getAllFeedback();
    Optional<Feedback> getFeedbackById(Long feedbackId);
    List<Feedback> getFeedbackByEventId(Long eventId);
    List<Feedback> getFeedbackByEmployeeId(Long employeeId);
    Feedback createFeedback(Feedback feedback);
    Feedback updateFeedback(Long feedbackId, Feedback feedbackDetails);
    Feedback patchFeedback(Long feedbackId, Feedback feedbackDetails);
    void deleteFeedback(Long feedbackId);
}
