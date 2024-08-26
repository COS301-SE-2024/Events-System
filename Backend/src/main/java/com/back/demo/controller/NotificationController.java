package com.back.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.back.demo.service.NotificationService;

import com.back.demo.Notifications;
import com.back.demo.model.Event;
import com.back.demo.model.Notification;


@RestController
public class NotificationController {

    // @Autowired
    // private SimpMessagingTemplate template;
    @Autowired
    private NotificationService notificationService;
    // Initialize Notifications
    private Notifications notifications = new Notifications(0, "");

    // @CrossOrigin(origins = "*")
    // @PostMapping("/notify")
    // public String getNotification(@RequestBody Notification Notif) {

    //     // Increment Notification by one
    //     notifications.increment();
    //     String message = "";
    //     notificationService.notifyAllEmployees(Notif);
    //     return "Notifications successfully sent to Angular!";
    //     // // Push notifications to front-end
    //     // template.convertAndSend("/topic/notification", notifications);

    //     // return "Notifications successfully sent to Angular !";
    // }

    @CrossOrigin(origins = "*") 
    @GetMapping("/api/notifications/count/{employeeId}")
    public int getNotificationCount(@PathVariable int employeeId) {
        return notificationService.getNotificationCountForEmployee(employeeId);
    }
    
    @CrossOrigin(origins = "*")
    @DeleteMapping("/api/notifications/{employeeId}")
    public ResponseEntity<Void> deleteAllNotificationsForEmployee(@PathVariable int employeeId) {
        notificationService.deleteAllNotificationsForEmployee(employeeId);
        return ResponseEntity.noContent().build();
    }
    @CrossOrigin(origins = "*")
    @DeleteMapping("/api/notifications/{employeeId}/markAllAsRead")
    public ResponseEntity<Void> markAllNotificationsAsRead(@PathVariable int employeeId) {
        notificationService.markAllNotificationsAsRead(employeeId);
        return ResponseEntity.noContent().build();
    }
    @CrossOrigin(origins = "*")
    @DeleteMapping("/api/notifications/{employeeId}/markAllAsUnRead")
    public ResponseEntity<Void> markAllNotificationsAsUnRead(@PathVariable int employeeId) {
        notificationService.markAllNotificationsAsUnread(employeeId);
        return ResponseEntity.noContent().build();
    }
        // New endpoint to get all notifications for a given employeeId
    @CrossOrigin(origins = "*")
    @GetMapping("/api/notifications/{employeeId}")
    public List<Notification> getNotificationsForEmployee(@PathVariable int employeeId) {
        return notificationService.getNotificationsForUser(employeeId);
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/api/notifications/{employeeId}/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable int employeeId, @PathVariable Long notificationId) {
        notificationService.deleteNotification(employeeId, notificationId);
        return ResponseEntity.noContent().build();
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/api/notifications/{employeeId}/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable int employeeId, @PathVariable Long notificationId) {
        notificationService.markNotificationAsRead(employeeId, notificationId);
        return ResponseEntity.ok().build();
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/api/notifications/{employeeId}/{notificationId}/unread")
    public ResponseEntity<Void> markNotificationAsUnRead(@PathVariable int employeeId, @PathVariable Long notificationId) {
        notificationService.markNotificationAsUnread(employeeId, notificationId);
        return ResponseEntity.ok().build();
    }
}
// @Controller
// public class NotificationController {

// 	@MessageMapping("/send")
// 	@SendTo("/topic/notifications")
// 	public String sendNotification(String message) {
// 		return message;
// 	}
// }
