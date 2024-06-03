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
  sanitizeInput(input: string): string {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  onSubmit(event: Event): void {
    event.preventDefault(); // Prevent the form from refreshing the page

    const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2}$/;
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);


    const title = this.sanitizeInput(formData.get('title') as string);
    const description = this.sanitizeInput(formData.get('description') as string);
    const startTime = this.sanitizeInput(formData.get('startTime') as string);
    const endTime = this.sanitizeInput(formData.get('endTime') as string);
    const location = this.sanitizeInput(formData.get('location') as string);
    const socialClub = this.sanitizeInput(formData.get('socialClub') as string);

    if (!dateTimePattern.test(startTime) || !dateTimePattern.test(endTime)) {
      alert('Invalid date-time format. It should be YYYY-MM-DDTHH:MM:SS.000+00:00');
      return;
    }
  

    if (!title) {
      alert('Title is required');
      return;
    }
    
    
    if (!description) {
      alert('Description is required');
      return;
    }
    
    
    if (!startTime) {
      alert('Start time is required');
      return;
    }
    
    
    if (!endTime) {
      alert('End time is required');
      return;
    }
    
    
    if (!location) {
      alert('Location is required');
      return;
    }
    
    
    if (!socialClub) {
      alert('Social club is required');
      return;
    }
    
    const eventDetails = {
      title,
      description,
      startTime,
      endTime,
      location,
      hostId: 1,
      geolocation: "new Geo",
      socialClub,
    };
  

    this.createEvent(eventDetails);
  }


  createEvent(event: any): void {
    fetch('https://events-system-back.wn.r.appspot.com/api/events', {
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
    fetch('https://events-system-back.wn.r.appspot.com/api/events')
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.events = Array.isArray(data) ? data : [data];
      });
  }
 




}