package com.back.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.back.demo.service.NotificationService;

import com.back.demo.Notifications;
import com.back.demo.model.Event;
import com.back.demo.model.Notification;


@RestController
public class NotificationController {

    @Autowired
    private SimpMessagingTemplate template;
    @Autowired
    private NotificationService notificationService;
    // Initialize Notifications
    private Notifications notifications = new Notifications(0, "");

    @CrossOrigin(origins = "*") // Replace with your frontend URL
    @PostMapping("/notify")
    public String getNotification(@RequestBody Notification Notif) {

        // Increment Notification by one
        notifications.increment();
        String message = "";
        notificationService.notifyAllEmployees(Notif);
        return "Notifications successfully sent to Angular!";
        // // Push notifications to front-end
        // template.convertAndSend("/topic/notification", notifications);

        // return "Notifications successfully sent to Angular !";
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
