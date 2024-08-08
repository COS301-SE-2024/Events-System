import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-host-checkin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './host-checkin.component.html',
  styleUrls: ['./host-checkin.component.css'],
})

export class HostCheckinComponent implements OnInit {
  eventTitle = 'Event Name';
  eventStarted = false;
  attendeesCount = 0;

  ngOnInit(): void {
    // Initially fetch the number of attendees if the event has already started
    this.fetchAttendeesCount();
  }

  checkInHost(): void {
    this.eventStarted = true;
    // Call the backend to indicate the event has started
    // For now, we'll simulate the start
    this.fetchAttendeesCount();
  }

  fetchAttendeesCount(): void {
    if (this.eventStarted) {
      // This would be a call to the backend to get the count of attendees
      // For the sake of this example, we'll simulate it
      this.attendeesCount = 50; // Replace with actual data fetching logic
    }
  }
}