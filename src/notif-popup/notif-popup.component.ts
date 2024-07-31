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
    { notificationId: 1, message: 'Notification Title 1', eventId: 'This is the description for notification 1.', read: false },
    { notificationId: 2, message: 'Notification Title 1', eventId: 'This is the description for notification 1.', read: false },
    { notificationId: 3, message: 'Notification Title 1', eventId: 'This is the description for notification 1.', read: false },
  ];

  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();

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
      // Slice the last three notifications
      this.notifications = data.slice(-3).reverse();
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
