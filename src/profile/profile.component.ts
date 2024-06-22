import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  selectedTab: string = 'about';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.logLocalStorageItem();
    this.getEmployeeById();
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  logLocalStorageItem() {
    const employeeId = localStorage.getItem('ID');
    console.log(employeeId);
  }

  getEmployeeById() {
    const employeeId = localStorage.getItem('ID');
    if (employeeId) {
      this.http.get(`https://events-system-back.wn.r.appspot.com/api/employees/${employeeId}`).subscribe(
        (data: any) => {
          //console.log(data);
          localStorage.setItem('employeeData', JSON.stringify(data));
          //log the data to the console
          console.log(localStorage.getItem('employeeData'));  
        },
        (error) => {
          console.error('Error fetching employee data', error);
        }
      );
    } else {
      console.warn('No ID found in localStorage');
    }
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
