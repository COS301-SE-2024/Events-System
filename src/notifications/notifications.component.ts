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

    {notificationId: 1, message: '', eventTitle: '', eventId: "", read: false, seriesTitle: '', seriesId: "" },
  ];

  selectedNotification: any = null;

  constructor(private router: Router) {}
  get allRead(): boolean {
    return this.notifications.every(notification => notification.read);
  }

  get allUnread(): boolean {
    return this.notifications.every(notification => !notification.read);
  }
  ngOnInit(): void {
    const employeeId = Number(localStorage.getItem('ID')); // Assuming the employeeId is stored in local storage
    if (!employeeId) {
      this.router.navigate(['/home']);
      return;
    }

    fetch(`https://events-system-back.wn.r.appspot.com/api/notifications/${employeeId}`, {
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
      this.notifications = data.map((notification:any) => ({
        ...notification,
        read: notification.readAt !== null
      }));
    })
    .catch(error => {
      console.error('Error fetching notifications:', error);
    });
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => notification.read = true);
    const empliD = Number(localStorage.getItem('ID'));
  
    fetch(`https://events-system-back.wn.r.appspot.com/api/notifications/${empliD}/markAllAsRead`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  markAllAsUnRead(): void {
    this.notifications.forEach(notification => notification.read = false);
    const empliD = Number(localStorage.getItem('ID'));
  
    fetch(`https://events-system-back.wn.r.appspot.com/api/notifications/${empliD}/markAllAsUnRead`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  markAsRead(event: MouseEvent, notificationId: number): void {
    event.stopPropagation(); // Prevents the click from bubbling up to the notification card
    const notification = this.notifications.find(n => n.notificationId === notificationId);
    if (notification) {
      notification.read = true;
    }
    const empliD = Number(localStorage.getItem('ID'));
    // console.log(`https://events-system-back.wn.r.appspot.com/api/notifications/${empliD}/${notificationId}`);
    fetch(`https://events-system-back.wn.r.appspot.com/api/notifications/${empliD}/${notificationId}/read`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
  
  markAsUnread(event: MouseEvent, notificationId: number): void {
    event.stopPropagation(); // Prevents the click from bubbling up to the notification card
    const notification = this.notifications.find(n => n.notificationId === notificationId);
    if (notification) {
      notification.read = false;
    }
    const empliD = Number(localStorage.getItem('ID'));
    fetch(`https://events-system-back.wn.r.appspot.com/api/notifications/${empliD}/${notificationId}/unread`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  delete(event: MouseEvent, notificationId: number): void {
    event.stopPropagation(); // Prevents the click from bubbling up to the notification card
    const empliD = Number(localStorage.getItem('ID'));
    // console.log(`https://events-system-back.wn.r.appspot.com/api/notifications/${empliD}/${notificationId}`);
    fetch(`https://events-system-back.wn.r.appspot.com/api/notifications/${empliD}/${notificationId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
    this.notifications = this.notifications.filter(n => n.notificationId !== notificationId);
  }

  clearAll(): void {
    this.notifications = [];
    const empliD = Number(localStorage.getItem('ID'));

    fetch(`https://events-system-back.wn.r.appspot.com/api/notifications/${empliD}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  openPopover(notification: any): void {
    this.selectedNotification = notification;
  }

  closePopover(): void {
    this.selectedNotification = null;
  }
}
