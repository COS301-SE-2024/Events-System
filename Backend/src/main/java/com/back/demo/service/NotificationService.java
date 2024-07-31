package com.back.demo.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.back.demo.model.Notification;
import com.back.demo.repository.NotificationRepository;
import com.back.demo.repository.EmployeeRepository;
import com.back.demo.repository.EventRSVPRepository;
import com.back.demo.model.Employee;
import com.back.demo.model.EventRSVP;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private EmployeeRepository employeeRepository;

        @Autowired
    private EventRSVPRepository eventRSVPRepository;

    public Notification createNotification(Notification notification) {
        Notification savedNotification = notificationRepository.save(notification);
        template.convertAndSend("/topic/notification", savedNotification);
        return savedNotification;
    }

    public List<Notification> getNotificationsForUser(Integer employeeId) {
        List<Notification> allNotifications = notificationRepository.findAll();
        List<Notification> userNotifications = new ArrayList<>();

        for (Notification notification : allNotifications) {
            if (notification.getEmployeeId().equals(Long.valueOf(employeeId))) {
                userNotifications.add(notification);
            }
        }
        return userNotifications;
    }

    public void notifyAllEmployees(Notification notif) {
        List<EventRSVP> rsvps = eventRSVPRepository.findByEventId(notif.getEventId());

        for (EventRSVP rsvp : rsvps) {
            Notification notification = new Notification();
            notification.setEmployeeId(rsvp.getEmployeeId().longValue());
            notification.setEventId(notif.getEventId());
            notification.setMessage(notif.getMessage());
            notificationRepository.save(notification);
            template.convertAndSend("/topic/notification" + rsvp.getEmployeeId(), notif.getMessage());

        }
    
    }
    // public void notifyAllEmployees(Notification notif) {
    //     notificationRepository.save(notif);
    //     List<Employee> employees = employeeRepository.findAll();
    //     List<EventRSVP> rsvps = eventRSVPRepository.findByEventId(notif.getEventId());
    //     for (EventRSVP rsvp : rsvps) {
    //         template.convertAndSend("/topic/notification" + rsvp.getEmployeeId(), notif.getMessage());
    //     }

    // }

    public int getNotificationCountForEmployee(int employeeId) {
        List<Notification> notifications = notificationRepository.findAll();
        int count = 0;
        for (Notification notification : notifications) {
            if (notification.getEmployeeId().equals(Long.valueOf(employeeId))) {
                count++;
            }
        }
        return count;
    }

    public void deleteNotification(int employeeId, Long notificationId) {
        List<Notification> notifications = notificationRepository.findAll();
        for (Notification notification : notifications) {
            if (notification.getNotificationId().equals(notificationId) && notification.getEmployeeId().equals(Long.valueOf(employeeId))) {
                notificationRepository.delete(notification);
            }
        }
    }
    public void markNotificationAsRead(int employeeId, Long notificationId) {
        List<Notification> notifications = notificationRepository.findAll();
        for (Notification notification : notifications) {
            if (notification.getNotificationId().equals(notificationId) && notification.getEmployeeId().equals(Long.valueOf(employeeId))) {
                notification.setReadAt(Timestamp.valueOf(LocalDateTime.now()));
                notificationRepository.save(notification);
            }
        }
    }

    public void deleteAllNotificationsForEmployee(int employeeId) {
        List<Notification> notifications = notificationRepository.findAll();
        for (Notification notification : notifications) {
            if (notification.getEmployeeId().equals(Long.valueOf(employeeId))) {
                notificationRepository.delete(notification);
            }
        }
    }
}