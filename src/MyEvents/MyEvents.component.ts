import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MyEventsCardComponent } from 'src/Components/MyEventsCard/MyEventsCard.component';
import { MyEventsCardSkeletonComponent } from 'src/Components/MyEventsCardSkeleton/MyEventsCardSkeleton.component';


@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, RouterModule, MyEventsCardComponent, MyEventsCardSkeletonComponent],
  templateUrl: './MyEvents.component.html',
  styleUrl: './MyEvents.component.css',
})
export class MyEventsComponent implements OnInit {
  isLoading = true;
  events: any[] = [];
  ngOnInit(): void {
    this.isLoading = true;
    fetch('https://events-system-back.wn.r.appspot.com/api/events')
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.events = Array.isArray(data) ? data : [data];
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error:', error);
        this.isLoading = false;
      });
  }
}
