import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-notif-popup',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notif-popup.component.html',
  styleUrls: ['./notif-popup.component.css'],
})
export class NotifPopupComponent implements OnInit {
  notifications = [
    {notificationId: 1, message: 'event deleted', eventTitle: 'This is the description for notification 1.', eventId: "ID 1", read: false },
    {notificationId: 2, message: 'event updated', eventTitle: 'This is the description for notification 1.', eventId: "ID 2", read: false },
    {notificationId: 3, message: 'event updated', eventTitle: 'This is the description for notification 1.', eventId: "ID 3", read: false },
  ];

  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    const employeeId = Number(localStorage.getItem('ID')); // Assuming the employeeId is stored in local storage
    if (!employeeId) {
      this.router.navigate(['/login']);
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
            // Filter unread notifications
            const unreadNotifications = data.filter((notification:any) => notification.readAt === null);

      // Slice the last three notifications
      this.notifications = unreadNotifications.slice(-3).reverse();

      // Extract the second part of the message
      this.notifications.forEach(notification => {
        const messageParts = notification.message.split(' ');
        notification.message = messageParts[1];
      });
    })
    .catch(error => {
      console.error('Error fetching notifications:', error);
    });
  }


  navigateAndClosePopup(): void {
    this.router.navigate(['/notifications']);
    this.closePopup.emit();
  }
}
