import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  notifications = [
    { id: 1, title: 'Notification Title 1', description: 'This is the description for notification 1.', read: false },
    { id: 2, title: 'Notification Title 2', description: 'This is the description for notification 2.', read: false },
    { id: 3, title: 'Notification Title 3', description: 'This is the description for notification 3.', read: false },
  ];

  selectedNotification: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  markAllAsRead(): void {
    this.notifications.forEach(notification => notification.read = true);
  }

  clearAll(): void {
    this.notifications = [];
  }

  markAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  openPopover(notification: any): void {
    this.selectedNotification = notification;
  }

  closePopover(): void {
    this.selectedNotification = null;
  }
}
