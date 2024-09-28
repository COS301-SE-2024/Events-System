import { FormsModule } from '@angular/forms';
import { Component, ViewEncapsulation, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { RefreshService } from './refresh.service';


@Component({
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, FullCalendarModule, NotifPopupComponent, ProfileComponent],
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
  isHost = false;
  isEmployee = false;
  public notificationCount = 0; // Add a property to store the notification count
 
  title = 'Events-System';
  isDrawerThin = false;
  isDarkTheme = false;
  employeeData: any;
  isPopoverVisible = false;

  private pwaServiceSubscriber?: Subscription;
  private routerEventsSubscription?: Subscription;
  private notificationSubscription?: Subscription;
  private notificationCountFetched = false; // Flag to ensure notification count is fetched only once

  constructor(private router: Router,
     private pwaService: PwaService,
      private notificationService: NotificationService,
      // private webSocketService: WebSocketService,
      private cdr: ChangeDetectorRef,
      private refreshService: RefreshService

    ) {
    this.notificationSubscription = this.notificationService.notification$.subscribe(() => {
      this.notificationCount++;
    });
    // Initialize employeeData from localStorage or any other source
    this.employeeData = JSON.parse(localStorage.getItem('employeeData') || '{}');
    if (this.employeeData && this.employeeData.id && !this.notificationCountFetched) {
      this.fetchNotificationCount();
      this.notificationCountFetched = true;
    }

    // Subscribe to router events
    this.routerEventsSubscription = this.router.events
    .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      if (event.url !== '/login' && !this.notificationCountFetched) {
        this.fetchNotificationCount();
      this.notificationCountFetched = true;

      }
    });
  }

  get isLoginRoute() {
    return this.router.url === '/login';
  }
  ngOnInit() {
    console.log(this.employeeData.role);
    if (this.employeeData.role == 'MANAGER'){
      this.isEmployee = true;
      this.isHost = true;
    }else{
      this.isEmployee = true;
      this.isHost = false;
    }
    this.refreshService.refreshNavbar$.subscribe(() => {
      this.refreshNavbar();
    });
    // this.webSocketService.connect();
    // this.webSocketService.notifications.subscribe((message: string) => {
      // this.showToast(message);
    // });
    this.checkCookies();
    // Apply the theme based on localStorage
    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  }

  getInitials(): string {
    const firstInitial = this.employeeData.firstName ? this.employeeData.firstName.charAt(0) : '';
    const lastInitial = this.employeeData.lastName ? this.employeeData.lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
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

  closeDrawer() {
    const drawerCheckbox = document.getElementById('my-drawer-2') as HTMLInputElement;
    if (drawerCheckbox) {
      drawerCheckbox.checked = false;
    }
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


  refreshNavbar() {
    this.employeeData = JSON.parse(localStorage.getItem('employeeData') || '{}');
    if(this.employeeData){
      if (this.employeeData.role == 'MANAGER'){
        this.isEmployee = true;
        this.isHost = true;
      }else{
        this.isEmployee = true;
        this.isHost = false;
      }
    }
    this.cdr.detectChanges();
  }




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
  
  logout() {
    this.checkCookies();

    fetch('https://events-system-back.wn.r.appspot.com/api/v1/auth/logout', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + this.getCookie('jwt'), // Ensure the token is passed
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
      if (response.ok) {
          // Successfully logged out
          localStorage.removeItem('ID');
          document.cookie = `jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          window.location.href = '/login'; // Redirect to login page or show logout success message
      }
      else {
        window.location.href = '/login';
      }
    })
    .catch(() => {
        window.location.reload();
    });
  }

  getCookie(cookieName: string) {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
  }

  async checkCookies() {
    // Get all cookies
    const cookies = document.cookie.split('; ');

    // Find the cookie by name
    let accessToken = null;
    let refreshToken = null;
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === "jwt") {
            accessToken = decodeURIComponent(value);
            break;
        }
    }
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === "refresh") {
          refreshToken = decodeURIComponent(value);
          break;
      }
    }
    
    if(!accessToken)        //If access token expired
    {
      if(!refreshToken)     //If refresh token expired
      {
        this.router.navigate(["/login"]);
      }

      try {
        const response = await fetch("https://events-system-back.wn.r.appspot.com/api/v1/auth/refresh-token", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getCookie("refresh")}`
            },
            body: JSON.stringify(FormData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const authData = await response.json();
        document.cookie = `jwt=${authData.access_token}; path=/; expires=` + new Date(new Date().getTime() + 15 * 60 * 1000).toUTCString();
        document.cookie = `refresh=${authData.refresh_token}; path=/; expires=` + new Date(new Date().getTime() + 24* 60 * 60 * 1000).toUTCString();
        console.log('Token refresh successful');
        // Handle the response data as needed
      } catch (error) {
          console.error('Error refreshing token');
          // Handle errors appropriately
      }
    }
  }
  onThemeChange() {
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  applyTheme() {
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}