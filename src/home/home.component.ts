import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {EventCardComponent} from 'src/Components/EventCard/eventCard.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, EventCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @Input() eventTitle: string | undefined;
  @Input() eventDescription: string | undefined;
  @Input() hostName: string | undefined;
  @Input() hostEmail: string | undefined;
  @Input() startTime: string | undefined;
  @Input() endTime: string | undefined;
  @Input() startDate: string | undefined;
  @Input() endDate: string | undefined;

  events: any[] = [];
  upcomingEvents = this.events;
  isLoading = true;
  event = {
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
    location: '',
    hostId: '',
    geolocation: '',
    socialClub: ''
    //hostEmail
  }; 
  
  ngOnInit(): void {
    fetch('https://events-system-back.wn.r.appspot.com/api/events')
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.events = Array.isArray(data) ? data : [data];
        this.prepareSlides();
        this.isLoading = false;
      });
  }

  displayedSlides: any[] = [];
  currentIndex: number = 0;
  eventsPerSlide: number = 2; //on large screen

  prepareSlides() 
  {
    for (let i = 0; i < this.events.length; i += this.eventsPerSlide) 
    {
      this.displayedSlides.push(this.events.slice(i, i + this.eventsPerSlide));
    }

    console.log(this.displayedSlides);
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.displayedSlides.length - 1;
    console.log( "Prev slide:" + this.currentIndex)
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex < this.displayedSlides.length - 1) ? this.currentIndex + 1 : 0;
    console.log("Next slide:" + this.currentIndex)
  }
}
