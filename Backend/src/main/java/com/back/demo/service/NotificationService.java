package com.back.demo.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.back.demo.model.Notification;
import com.back.demo.repository.NotificationRepository;
import com.back.demo.repository.EmployeeRepository;
import com.back.demo.model.Employee;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Notification createNotification(Notification notification) {
        Notification savedNotification = notificationRepository.save(notification);
        template.convertAndSend("/topic/notification", savedNotification);
        return savedNotification;
    }

    public List<Notification> getNotificationsForUser(Integer employeeId) {
        return notificationRepository.findByEmployeeId(employeeId);
    }

    public void notifyAllEmployees(Notification notif) {
        List<Employee> employees = employeeRepository.findAll();
        for (Employee employee : employees) {
            Notification notification = new Notification();
            notification.setEmployeeId(employee.getEmployeeId());
            notification.setEventId(notif.getEventId());
            notification.setMessage(notif.getMessage());
            notificationRepository.save(notification);
        }
        template.convertAndSend("/topic/notification", notif.getMessage());
    }
}