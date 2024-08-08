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
  eventID = '123'; // Example event ID
  eventStarted = false;
  attendeesCount = 0;
  attendees: Array<{ name: string }> = []; // Array to hold attendee names
  rsvpedNotAttended: Array<{ name: string }> = []; // Array to hold RSVPed but not attended

  // Simulated data
  private simulatedAttendees: Array<{ name: string }> = [
    { name: 'John Doe' },
    { name: 'Jane Smith' },
    { name: 'Alice Johnson' }
  ];
  
  private simulatedRsvped: Array<{ name: string }> = [
    { name: 'Mary Brown' },
    { name: 'David Wilson' }
  ];

  constructor() {}

  ngOnInit(): void {}

  // Simulate the check-in process
  checkInHost(): void {
      this.eventStarted = true;
      this.attendees = [...this.simulatedAttendees, { name: 'New Attendee' }];
      this.attendeesCount = this.attendees.length;
      this.rsvpedNotAttended = this.simulatedRsvped; // Initially set all RSVPed but not attended
    
  }

  // Simulate attendance mark
  markAttendance(name: string): void {
    // Remove from RSVPed but not attended list
    this.rsvpedNotAttended = this.rsvpedNotAttended.filter(attendee => attendee.name !== name);
    // Add to attendees list
    if (!this.attendees.find(att => att.name === name)) {
      this.attendees.push({ name });
      this.attendeesCount = this.attendees.length;
    }
  }
}