import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from 'src/Components/event/event.component';
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
    event.preventDefault(); // Prevent the form from refreshing the page


    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);


    const eventDetails = {
      title: formData.get('title'),
      description: formData.get('description'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      location: formData.get('location'),
      hostId: 1,
      geolocation: "new Geo",
      socialClub: formData.get('socialClub'),
      // Add other fields as necessary
    };


    this.createEvent(eventDetails);
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
 




}
