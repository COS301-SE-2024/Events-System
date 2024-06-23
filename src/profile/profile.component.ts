import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})

export class ProfileComponent implements OnInit {
  selectedTab = 'about';
  employeeData: any; // Define employeeData property

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedEmployeeData = localStorage.getItem('employeeData');
    if (storedEmployeeData) {
      this.employeeData = JSON.parse(storedEmployeeData);
      console.log(this.employeeData);
    } else {
      // Handle case where employeeData is not available in localStorage
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

  tabContents.forEach(content => content.classList.add('hidden'));
  tabs.forEach(tab => tab.classList.remove('tab-active'));

  tabContents[index].classList.remove('hidden');
  tab.classList.add('tab-active');
}

