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

  closePopup(): void {
    this.isPopoverVisible = false;
  }

  selectedNotification: any = null;

  ngOnInit(): void {}



}
