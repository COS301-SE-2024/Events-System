import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {EventCardComponent} from 'src/Components/EventCard/eventCard.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, EventCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @Input() eventTitle: string | undefined;
  @Input() eventDescription: string | undefined;
  @Input() hostName: string | undefined;
  @Input() hostEmail: string | undefined;
  @Input() startTime: string | undefined;
  @Input() endTime: string | undefined;
  @Input() startDate: string | undefined;
  @Input() endDate: string | undefined;

  events: any[] = [];
  upcomingEvents = this.events;
  isLoading = true;
  event = {
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
    location: '',
    hostId: '',
    geolocation: '',
    socialClub: ''
    //hostEmail
  }; 
  
  
  ngOnInit(): void {
    fetch('https://events-system-back.wn.r.appspot.com/api/events')
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.events = Array.isArray(data) ? data : [data];
        //this.filterEvents();
        this.isLoading = false;
      });
  }

  // UpcomingEvents() 
  // {
     
  // }
}
