import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent implements OnInit{
  eventId= '';
  event: any = null;
  host: any = null;
  isLoading = true;

  constructor(private route: ActivatedRoute) { }
  goBack(): void {
    window.history.back();
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];

      fetch('https://events-system-back.wn.r.appspot.com/api/events/' + this.eventId)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.event = data;
        // console.log(this.event);
        this.event.startTime = this.formatTime(this.event.startTime);
        this.event.endTime = this.formatTime(this.event.endTime);
        // Get the host information
        fetch('https://events-system-back.wn.r.appspot.com/api/employees/' + this.event.hostId)
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.host = data;
          // console.log(this.host); // Log the host data
          this.isLoading = false;

        });
      });
    });
  }

  formatTime(time: string | undefined): string | undefined {
    if (time) {
      const parts = time.split(':');
      return parts[0] + ':' + parts[1];
    }
    return undefined;
  }

  isAccommodationAvailable(accommodation: string): boolean {
    return this.event?.eventDietaryAccommodations.includes(accommodation);
  }
}