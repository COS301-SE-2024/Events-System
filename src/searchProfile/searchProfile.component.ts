import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {AttendedEventCardComponent} from 'src/Components/AttendedEventCard/attendedEventCard.component'

@Component({
  selector: 'app-search-profile',
  standalone: true,
  imports: [CommonModule, AttendedEventCardComponent],
  templateUrl: './searchProfile.component.html',
  styleUrl: './searchProfile.component.css',
})
export class SearchProfileComponent implements OnInit {
  selectedTab = 'about';
  employeeData: any; // Define employeeData property
  events: any[] = [];
  constructor(private route: ActivatedRoute) {}
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
    const storedEmployeeData1 = params['id'];
    const employeeID = storedEmployeeData1;
    fetch(`https://events-system-back.wn.r.appspot.com/api/employees/${storedEmployeeData1}`)
    .then(response => response.json())
    .then(data => {
      this.employeeData = data;
    })
    .catch(error => {
      console.error('Error fetching employee data:', error);
    });

    fetch(`https://events-system-back.wn.r.appspot.com/api/events/employee/${employeeID}/events-attended`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      this.events = data;
      console.log(this.events);
      // return Array.isArray(data) ? data : [data];
    })
    .catch(error => {
      console.error('Error fetching attended events:', error);
      return [];
    });
    const storedEmployeeData = localStorage.getItem('employeeData');
    if (storedEmployeeData) {
      this.employeeData = JSON.parse(storedEmployeeData);
      console.log(this.employeeData);
    }
  }
    )}
}
