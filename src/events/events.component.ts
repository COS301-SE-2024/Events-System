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


  ngOnInit(): void {
    fetch('/api/events')
      .then(response => {
        console.log(response); // This will log the raw response object
        return response.json();
      })
      .then(data => {
        console.log(data); // This will log the parsed JSON data
        this.events = Array.isArray(data) ? data : [data];
      });
  }
  
    

}
