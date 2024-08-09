import { Component, ViewEncapsulation, ViewChild, ElementRef, OnInit } from '@angular/core';
import { RouterModule, Router, Event, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

import { FullCalendarModule } from '@fullcalendar/angular';

import { NotifPopupComponent } from 'src/notif-popup/notif-popup.component';
import { ProfileComponent } from 'src/profile/profile.component';
import { PwaService } from './pwa.service'; // Adjust the path as necessary
import { Subscription } from 'rxjs';
import { NotificationService } from './notification.service';
import { WebSocketService } from './websocket.service';


@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, FullCalendarModule, NotifPopupComponent, ProfileComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WebSocketService],
  encapsulation: ViewEncapsulation.Emulated,
    template: `
        <button class="button button-primary" (click)="subscribeToNotifications()">
          Subscribe
        </button>;`
})
export class AppComponent implements OnInit{
  @ViewChild('toastContainer', { static: true }) toastContainer!: ElementRef;

  public notificationCount = 0; // Add a property to store the notification count

  title = 'Events-System';
  isDrawerThin = false;

  employeeData: any;
  isPopoverVisible = false;

  private pwaServiceSubscriber?: Subscription;
  private routerEventsSubscription?: Subscription;
  private notificationSubscription?: Subscription;

  constructor(private router: Router,
     private pwaService: PwaService,
      private notificationService: NotificationService,
      private webSocketService: WebSocketService

    ) {
    this.notificationSubscription = this.notificationService.notification$.subscribe(() => {
      this.notificationCount++;
    });
    // Initialize employeeData from localStorage or any other source
    this.employeeData = JSON.parse(localStorage.getItem('employeeData') || '{}');
    if (this.employeeData && this.employeeData.id) {
      this.fetchNotificationCount();
    }

    // Subscribe to router events
    this.routerEventsSubscription = this.router.events
    .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      if (event.url !== '/login') {
        this.fetchNotificationCount();
      }
    });
  }

  get isLoginRoute() {
    return this.router.url === '/login';
  }
  ngOnInit() {
    this.webSocketService.connect();
    this.webSocketService.notifications.subscribe((message: string) => {
      this.showToast(message);
    });
  }
  showToast(message: string) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="alert alert-info">
        <span>${message}</span>
      </div>
    `;
    this.toastContainer.nativeElement.appendChild(toast);

    // Remove the toast after a few seconds
    setTimeout(() => {
      this.toastContainer.nativeElement.removeChild(toast);
    }, 3000);
  }
  subscribeToNotifications() {
    // Example method to trigger a notification
    this.notificationService.notify();
  }

  toggleDrawer() {
    this.isDrawerThin = !this.isDrawerThin;
  }

  togglePopover() {
    this.isPopoverVisible = !this.isPopoverVisible;
  }

  closePopup(): void {
    this.isPopoverVisible = false;
  }

  selectedNotification: any = null;







  installPwa(): void {
    console.log('Attempting to install PWA');
    this.pwaService.promptUserForInstallation();
  }

  ngOnDestroy(): void {
    this.pwaServiceSubscriber?.unsubscribe();
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }
  fetchNotificationCount(): Promise<number> {
    return fetch(`https://events-system-back.wn.r.appspot.com/api/notifications/count/${localStorage.getItem('ID')}`, {
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(count => {
      console.log(`Notification count for employee ${localStorage.getItem('ID')}: ${count}`);
      // Store the notification count in a component property
      this.notificationCount = count;
      return count; // Return the count
    })
    .catch(error => {
      console.error('Error fetching notification count:', error);
      return 0; // Return a default value in case of error
    });
  }

}

