import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AttendedEventCardComponent } from 'src/Components/AttendedEventCard/attendedEventCard.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, AttendedEventCardComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  selectedTab = 'about';
  employeeData: any; // Define employeeData property
  events: any[] = [];
  hostedevents: any[] = [];
  isHost = false;

  constructor(private router: Router) {}

  getInitials(): string {
    const firstInitial = this.employeeData.firstName ? this.employeeData.firstName.charAt(0) : '';
    const lastInitial = this.employeeData.lastName ? this.employeeData.lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  ngOnInit(): void {
    const employeeID = Number(localStorage.getItem('ID'));
    const role = localStorage.getItem('Role');

    this.isHost = role === 'MANAGER';

    // Fetch attended events
    fetch(`https://events-system-back.wn.r.appspot.com/api/events/employee/${employeeID}/events-attended`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        this.events = data;
      })
      .catch(error => {
        console.error('Error fetching attended events:', error);
        return [];
      });

    // Fetch hosted events if the user is a host
    if (this.isHost) {
      fetch(`https://events-system-back.wn.r.appspot.com/api/events/host/${employeeID}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.hostedevents = this.hostedevents.concat(data);
        })
        .catch(error => {
          console.error('Error fetching hosted events:', error);
          return [];
        });
    }

    const storedEmployeeData = localStorage.getItem('employeeData');
    if (storedEmployeeData) {
      this.employeeData = JSON.parse(storedEmployeeData);
      console.log(this.employeeData);
    }
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeTabs();
});

function initializeTabs() {
  const tabContents = document.querySelectorAll<HTMLElement>('.tab-content');
  const tabs = document.querySelectorAll<HTMLElement>('.tab');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      openTab(tab, index);
    });
  });

  // Show the first tab content by default
  if (tabContents.length > 0) {
    tabContents[0].classList.remove('hidden');
    tabs[0].classList.add('tab-active');
  }
}

function openTab(tab: HTMLElement, index: number) {
  const tabContents = document.querySelectorAll<HTMLElement>('.tab-content');
  const tabs = document.querySelectorAll<HTMLElement>('.tab');

  // Ensure the index is within bounds
  if (index >= tabContents.length) {
    return;
  }

  tabContents.forEach(content => content.classList.add('hidden'));
  tabs.forEach(tab => tab.classList.remove('tab-active'));

  tabContents[index].classList.remove('hidden');
  tab.classList.add('tab-active');
}