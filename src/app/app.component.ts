import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NotifPopupComponent } from 'src/notif-popup/notif-popup.component';
import { ProfileComponent } from 'src/profile/profile.component';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, FullCalendarModule, NotifPopupComponent, ProfileComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent {
  title = 'Events-System';
  isDrawerThin = false;
  employeeData: any;
  isPopoverVisible = false;

  constructor(private router: Router) {
    this.employeeData = JSON.parse(localStorage.getItem('employeeData') || '{}');
  }

  get isLoginRoute() {
    return this.router.url === '/login';
  }

  toggleDrawer() {
    this.isDrawerThin = !this.isDrawerThin;
  }

  togglePopover() {
    this.isPopoverVisible = !this.isPopoverVisible;
  }

  notifications = [
    { id: 1, title: 'Notification Title 1', read: false },
    { id: 2, title: 'Notification Title 2', read: false },
    { id: 3, title: 'Notification Title 3', read: false },
  ];

  selectedNotification: any = null;

  ngOnInit(): void {}

  markAllAsRead(): void {
    this.notifications.forEach(notification => notification.read = true);
  }

  clearAll(): void {
    this.notifications = [];
  }

  markAsRead(event: MouseEvent, notificationId: number): void {
    event.stopPropagation();
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
