import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent {
  title = 'Events-System';
  isDrawerThin = false;
  employeeData: any; // Define employeeData property

  constructor() {
    // Initialize employeeData from localStorage or any other source
    this.employeeData = JSON.parse(localStorage.getItem('employeeData') || '{}');
  }

  toggleDrawer() {
    this.isDrawerThin = !this.isDrawerThin;
  }
}
