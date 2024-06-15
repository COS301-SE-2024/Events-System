import { Component, Input, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {EventCardComponent} from 'src/Components/EventCard/eventCard.component'
import {SocialClubCardComponent} from 'src/Components/SocialClubCard/socialClubCard.component'
import { ViewportScroller } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, EventCardComponent, SocialClubCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private cdr: ChangeDetectorRef) { }

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
    socialClub: '',
        host: '',
    //hostEmail
  }; 

  currentSlideIndex = 0;
  nextSlideIndex = '';
  previousSlideIndex = '';

  currentSocialClubSlideIndex = 0;
  nextSocialClubSlideIndex = '';
  previousSocialClubSlideIndex = '';


  slides: any[] = []; 
  ngOnInit(): void {
    fetch('https://events-system-back.wn.r.appspot.com/api/events')
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.events = Array.isArray(data) ? data : [data];
  
        
        const hostFetches = this.events.map(event => {
          return fetch('https://events-system-back.wn.r.appspot.com/api/employees/' + event.hostId)
            .then(response => {
              return response.json();
            })
            .then(data => {
              event.host = data;
            });
        });
  
  
        
        Promise.all(hostFetches).then(() => {
          
          this.slides = this.events.map((eventData, index) => {
            const slide = {
              id: `slide${index + 11}`,
              title: eventData.title,
              description: eventData.description,
              startTime: eventData.startTime,
              endTime: eventData.endTime,
              startDate: eventData.startDate,
              endDate: eventData.endDate,
              location: eventData.location,
              hostId: eventData.hostId,
              geolocation: eventData.geolocation,
              socialClub: eventData.socialClub,
              host: eventData.host 
            };
            this.cdr.detectChanges(); 
            return slide;
          });
  
          
          this.isLoading = false;
        });
      });
  }
  nextUSlide() {
    if (this.currentSlideIndex === this.slides.length - 3) {    
      this.currentSlideIndex = 0;   
      this.nextSlideIndex = this.slides[this.currentSlideIndex].id || '';    
      console.log("last current " + this.currentSlideIndex);    
      console.log("last next " + this.nextSlideIndex);    
    }else
    if (this.currentSlideIndex < this.slides.length - 1) {    
      this.currentSlideIndex += 1;    
      this.nextSlideIndex = this.slides[this.currentSlideIndex + 2].id  || '';    
    }
    console.log("current " + this.currentSlideIndex);   
    console.log("next " + this.nextSlideIndex);   
  }
  
  previousUSlide() {
    if (this.currentSlideIndex > 0) {   
      this.currentSlideIndex -= 1;    
      this.previousSlideIndex = this.slides[this.currentSlideIndex].id  || '';    
    }

  }

  nextSCSlide() {
    if (this.currentSocialClubSlideIndex === this.slides.length - 3) {    
      this.currentSocialClubSlideIndex = 0;   
      this.nextSocialClubSlideIndex = this.slides[this.currentSocialClubSlideIndex].id || '';    
      console.log("last current " + this.currentSocialClubSlideIndex);    
      console.log("last next " + this.nextSocialClubSlideIndex);    
    }else
    if (this.currentSocialClubSlideIndex < this.slides.length - 1) {    
      this.currentSocialClubSlideIndex += 1;    
      this.nextSocialClubSlideIndex = this.slides[this.currentSocialClubSlideIndex + 2].id  || '';    
    }
    console.log("current " + this.currentSocialClubSlideIndex);   
    console.log("next " + this.nextSocialClubSlideIndex);   
  }
  
  previousSCSlide() {
    if (this.currentSocialClubSlideIndex > 0) {   
      this.currentSocialClubSlideIndex -= 1;    
      this.previousSocialClubSlideIndex = this.slides[this.currentSocialClubSlideIndex].id  || '';    
    }

  }
}
