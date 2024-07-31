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

    {notificationId: 1, message: 'Notification Title 1', eventId: 'This is the description for notification 1.', read: false },
    {notificationId: 2, message: 'Notification Title 1', eventId: 'This is the description for notification 1.', read: false },
    {notificationId: 3, message: 'Notification Title 1', eventId: 'This is the description for notification 1.', read: false },
  ];

  selectedNotification: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const employeeId = Number(localStorage.getItem('ID')); // Assuming the employeeId is stored in local storage
    if (!employeeId) {
      this.router.navigate(['/login']);
      return;
    }

    fetch(`http://localhost:8080/api/notifications/${employeeId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      this.notifications = data.map((notification :any)=> ({
        ...notification,
        read: notification.read_at !== null
      }));
    })
    .catch(error => {
      console.error('Error fetching notifications:', error);
    });
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => notification.read = true);
  }

  clearAll(): void {
    this.notifications = [];
    const empliD = Number(localStorage.getItem('ID'));

    fetch(`http://localhost:8080/api/notifications/${empliD}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  markAsRead(event: MouseEvent, notificationId: number): void {
    event.stopPropagation(); // Prevents the click from bubbling up to the notification card
    const notification = this.notifications.find(n => n.notificationId === notificationId);
    if (notification) {
      notification.read = true;
    }
    const empliD = Number(localStorage.getItem('ID'));
    console.log(`http://localhost:8080/api/notifications/${empliD}/${notificationId}`);
    fetch(`http://localhost:8080/api/notifications/${empliD}/${notificationId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
      
    })

  }
  
  delete(event: MouseEvent, notificationId: number): void {
    event.stopPropagation(); // Prevents the click from bubbling up to the notification card
    const empliD = Number(localStorage.getItem('ID'));
    console.log(`http://localhost:8080/api/notifications/${empliD}/${notificationId}`);
    fetch(`http://localhost:8080/api/notifications/${empliD}/${notificationId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
    this.notifications = this.notifications.filter(n => n.notificationId !== notificationId);

  }

  openPopover(notification: any): void {
    this.selectedNotification = notification;
  }

  closePopover(): void {
    this.selectedNotification = null;
  }
}
