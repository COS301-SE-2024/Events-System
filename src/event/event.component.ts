import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RandomHeaderService } from '../app/random-header.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent implements OnInit{
  imageSource: string;
  eventId= '';
  event: any = null;
  host: any = null;
  isLoading = true;

  club: any = null;
  constructor(private route: ActivatedRoute, private randomHeaderService: RandomHeaderService) { 
    this.imageSource = '';
  }
  goBack(): void {
    window.history.back();
  }
  ngOnInit(): void {
    this.imageSource = this.randomHeaderService.getRandomHeaderSource();
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
          fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + this.event.socialClub)
          .then(response => {
            return response.json();
          })
          .then(data => {
            this.club = data;
            this.isLoading = false;
    
          });

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