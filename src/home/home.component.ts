import { Component, Input, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {HomeEventCardComponent} from 'src/Components/HomeEventCard/HomeEventCard.component'
import {HomeFeaturedEventComponent} from 'src/Components/HomeFeaturedEvent/HomeFeaturedEvent.component'
import {SocialClubCardComponent} from 'src/Components/SocialClubCard/socialClubCard.component'
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
const myCredentials = {
  username: 'myUsername',
  password: 'myPassword'
};






export interface Slide {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  location: string;
  hostId: string;
  geolocation: string;
  socialClub: string;
  host: any; // replace 'any' with the actual type of 'host'
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HomeEventCardComponent, SocialClubCardComponent, HomeFeaturedEventComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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




  currentHomeSlideIndex = 0;
  previousHomeSlideIndex = '';
  nextHomeSlideIndex = '';
  Homeslides: Slide[] = [];
  currentSocialClubSlideIndex = 0;
  nextSocialClubSlideIndex = '';
  previousSocialClubSlideIndex = '';
  selectedDate = '';
  allSlides: any[] = [];
  numbers = Array(6).fill(0).map((x,i)=>i);
  slides: any[] = [];
  socialClubs : any[] = [];
  @ViewChild('carousel1') carousel1!: ElementRef;
  @ViewChild('carousel2') carousel2!: ElementRef;
  @ViewChild('carousel3') carousel3!: ElementRef;
 
  ngOnInit(): void {
    const employeeId = Number(localStorage.getItem('ID')); // Assuming the employeeId is stored in local storage
 
    fetch('https://events-system-back.wn.r.appspot.com/api/events')
      .then(response => response.json())
      .then(data => {
        this.events = Array.isArray(data) ? data : [data];
 
        const hostFetches = this.events.map(event => fetch('https://events-system-back.wn.r.appspot.com/api/employees/' + event.hostId)
          .then(response => response.json())
          .then(data => {
            event.host = data;
          }));
 
        const socialClubsFetch = fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs')
          .then(response => response.json())
          .then(data => {
            this.socialClubs = Array.isArray(data) ? data : [data];
          });
 
        return Promise.all([...hostFetches, socialClubsFetch]);
      })
      .then(() => {
        this.slides = this.events.map((eventData, index) => {
          const slide = {
            id: eventData.eventId,
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
 
        this.allSlides = [...this.slides];
        this.Homeslides = JSON.parse(JSON.stringify(this.slides.slice(0, 10)));
 
        // Fetch RSVPs and filter slides
        fetch('https://events-system-back.wn.r.appspot.com/api/event-rsvps')
          .then(response => response.json())
          .then(data => {
            const rsvps = Array.isArray(data) ? data : [data];
            const eventIds = rsvps.filter(rsvp => rsvp.employeeId === employeeId).map(rsvp => rsvp.eventId);
            this.slides = this.slides.filter(slide => eventIds.includes(slide.id));


            // Group RSVPs by event ID and count them
          const rsvpCounts = rsvps.reduce((counts, rsvp) => {
            counts[rsvp.eventId] = (counts[rsvp.eventId] || 0) + 1;
            return counts;
          }, {});


            // Sort slides based on RSVP count
            this.slides.sort((a, b) => (rsvpCounts[b.id] || 0) - (rsvpCounts[a.id] || 0));
            this.Homeslides = JSON.parse(JSON.stringify(this.slides.slice(0, 10)));
          });
 
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  nextHSlide() {
    this.carousel1.nativeElement.scrollLeft += this.carousel1.nativeElement.offsetWidth;
    if (this.currentHomeSlideIndex === this.Homeslides.length - 1) {    
      this.currentHomeSlideIndex = 0;  
    } else if (this.currentHomeSlideIndex < this.Homeslides.length - 1) {    
      this.currentHomeSlideIndex += 1;    
    }
    this.nextHomeSlideIndex = this.Homeslides[this.currentHomeSlideIndex].id || '';  
  }
 
  previousHSlide() {
    this.carousel1.nativeElement.scrollLeft -= this.carousel1.nativeElement.offsetWidth;
    if (this.currentHomeSlideIndex > 0) {  
      this.currentHomeSlideIndex -= 1;    
      this.previousHomeSlideIndex = this.Homeslides[this.currentHomeSlideIndex].id  || '';    
    }




  }
  nextUSlide() {
    const singleSlideWidth = this.carousel2.nativeElement.offsetWidth / 3;
    this.carousel2.nativeElement.scrollLeft += singleSlideWidth;
  }
 
  previousUSlide() {
  const singleSlideWidth = this.carousel2.nativeElement.offsetWidth / 3;
  this.carousel2.nativeElement.scrollLeft -= singleSlideWidth;
  }




  nextSCSlide() {
    const singleSlideWidth = this.carousel3.nativeElement.offsetWidth / 3;
    this.carousel3.nativeElement.scrollLeft += singleSlideWidth;
  }
 
 
  previousSCSlide() {
    const singleSlideWidth = this.carousel3.nativeElement.offsetWidth / 3;
    this.carousel3.nativeElement.scrollLeft -= singleSlideWidth;
  }












  filterByDate(date: string) {
    this.selectedDate = date;
    this.slides = this.allSlides.filter(slide => slide.startDate === this.selectedDate);
  }




  clearDate(dateInput: HTMLInputElement) {
    this.selectedDate = '';
    dateInput.value = '';
    this.slides = [...this.allSlides];
  }
}




