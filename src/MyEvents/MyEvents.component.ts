import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyEventsCardComponent } from 'src/Components/MyEventsCard/MyEventsCard.component';


@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, RouterModule, MyEventsCardComponent],
  templateUrl: './MyEvents.component.html',
  styleUrl: './MyEvents.component.css',
})
export class MyEventsComponent implements OnInit {
  events: any[] = [];
  ngOnInit(): void {
    fetch('https://events-system-back.wn.r.appspot.com/api/events')
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.events = Array.isArray(data) ? data : [data];
        console.log(this.events);
      });
  }
}
