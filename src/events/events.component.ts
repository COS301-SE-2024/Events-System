import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from 'src/Components/event/event.component';
import { FormControl, Validators } from '@angular/forms';
import { response } from 'express';


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, EventComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})


export class EventsComponent implements OnInit {
  events: any[] = [];
  eventCreated = false;


  event = {
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    hostId: 1, // replace with actual host ID
    geolocation: '', // replace with actual geolocation
    socialClub: ''
  };
  onSubmit(event: Event): void {
    event.preventDefault();


    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
 
    let title = formData.get('title') as string;
    let description = formData.get('description') as string;
    let startDate = formData.get('startDate') as string;
    let startTime = formData.get('startTime') as string;
    let endDate = formData.get('endDate') as string;
    let endTime = formData.get('endTime') as string;
  
    let location = formData.get('location') as string;
    let socialClub = formData.get('socialClub') as string;

      // Combine date and time into a single string
    let startDateTime = `${startDate}T${startTime}:00Z`;
    let endDateTime = `${endDate}T${endTime}:00Z`;

    // Convert to Date objects
    let start = new Date(startDateTime);
    let end = new Date(endDateTime);


    // Check if end time is before start time
    if (end < start) {
      alert('End time cannot be before start time');
      return;
    }

    // Sanitize the form values
    title = this.sanitizeInput(title);
    description = this.sanitizeInput(description);
    // Sanitize the date-time strings
    startDateTime = this.sanitizeInput(startDateTime);
    endDateTime = this.sanitizeInput(endDateTime);

    location = this.sanitizeInput(location);
    socialClub = this.sanitizeInput(socialClub);
    // Check each form value
    if (!title) {
      alert('Title is required.');
      return;
    }
    if (!description) {
      alert('Description is required.');
      return;
    }
    if (!location) {
      alert('Location is required.');
      return;
    }
    if (!socialClub) {
      alert('Social club is required.');
      return;
    }
 
    const eventDetails = {
      title,
      description,
      startDateTime,
      endDateTime,
      location,
      hostId: 1,
      geolocation: "new Geo",
      socialClub,
    };
 
    this.createEvent(eventDetails);
  }
  sanitizeInput(input: string): string {
    // Remove any script tags
    const sanitizedInput = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    return sanitizedInput;
  }
  createEvent(event: any): void {
    fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data); // Log the response data for debugging
      this.eventCreated = true; // Set eventCreated to true
      // Hide the toast after 5 seconds
      setTimeout(() => {
        this.hideToast();
      }, 5000);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }


  ngOnInit(): void {
    fetch('/api/events')
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.events = Array.isArray(data) ? data : [data];
      });
  }
 
  hideToast(): void {
    this.eventCreated = false;
  }


}



