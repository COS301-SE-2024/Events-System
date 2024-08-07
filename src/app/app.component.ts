import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, FullCalendarModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
    template: `
        <button class="button button-primary" (click)="subscribeToNotifications()">
          Subscribe
        </button>;`
})
export class AppComponent {
  
  title = 'Events-System';
  isDrawerThin = false;
  employeeData: any; // Define employeeData property

  constructor(private router: Router) {
    // Initialize employeeData from localStorage or any other source
    this.employeeData = JSON.parse(localStorage.getItem('employeeData') || '{}');
  }
  get isLoginRoute() {
    return this.router.url === '/login';
  }
  toggleDrawer() {
    this.isDrawerThin = !this.isDrawerThin;
  }
}
