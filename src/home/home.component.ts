import { Component, Input, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {HomeEventCardComponent} from 'src/Components/HomeEventCard/HomeEventCard.component'
import {HomeFeaturedEventComponent} from 'src/Components/HomeFeaturedEvent/HomeFeaturedEvent.component'
import {SocialClubCardComponent} from 'src/Components/SocialClubCard/socialClubCard.component'
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { HomeUpcomingSkeletonComponent } from 'src/Components/HomeUpcomingSkeleton/HomeUpcomingSkeleton.component';
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
  imports: [CommonModule, RouterModule, HomeEventCardComponent, SocialClubCardComponent, HomeFeaturedEventComponent, HomeUpcomingSkeletonComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef, private router: Router) { }


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

  index2 = 3;
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
  allRsvpdSlides: Slide[] = [];

  @ViewChild('carousel1') carousel1!: ElementRef;
  @ViewChild('carousel2') carousel2!: ElementRef;
  @ViewChild('carousel3') carousel3!: ElementRef;
  rsvpdSlides: Slide[] = [];
  ngOnInit() {
    const employeeId = Number(localStorage.getItem('ID')); // Assuming the employeeId is stored in local storage

    this.checkCookies();

    if (!employeeId) {
      this.router.navigate(['/login']);
      return;
    }
  
    fetch('https://events-system-back.wn.r.appspot.com/api/events', {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
  })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        // Check if the response is not empty before parsing
        const data = text ? JSON.parse(text) : [];
        this.events = Array.isArray(data) ? data : [data];
  
        const hostFetches = this.events.map(event => fetch('https://events-system-back.wn.r.appspot.com/api/employees/' + event.hostId, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(text => {
          const data = text ? JSON.parse(text) : {};
          event.host = data;
        }));

  
        const socialClubsFetch = fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(text => {
          const data = text ? JSON.parse(text) : [];
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
  
        // Fetch RSVPs and filter slides
        fetch('https://events-system-back.wn.r.appspot.com/api/event-rsvps')
          .then(response => response.json())
          .then(data => {
            const rsvps = Array.isArray(data) ? data : [data];
  
            // Group RSVPs by event ID and count them
            const rsvpCounts = rsvps.reduce((counts, rsvp) => {
              counts[rsvp.eventId] = (counts[rsvp.eventId] || 0) + 1;
              return counts;
            }, {});
  
            // Sort all slides based on RSVP count for home slides
            const sortedSlides = [...this.slides].sort((a, b) => (rsvpCounts[b.id] || 0) - (rsvpCounts[a.id] || 0));
            this.Homeslides = JSON.parse(JSON.stringify(sortedSlides.slice(0, 10)));
  
            // Filter slides based on the current user's RSVP'd events for RSVP'd slides
            const eventIds = rsvps.filter(rsvp => rsvp.employeeId === employeeId).map(rsvp => rsvp.eventId);
            this.rsvpdSlides = this.slides.filter(slide => eventIds.includes(slide.id));
            this.allRsvpdSlides = this.slides.filter(slide => eventIds.includes(slide.id));
            this.isLoading = false;

          });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  filterByDate(date: string) {
    this.selectedDate = date;
  this.rsvpdSlides = this.rsvpdSlides.filter(slide => slide.startDate === this.selectedDate);
  }

  updateFilteredRsvpdSlides(): void {
    if (this.selectedDate) {
      this.rsvpdSlides = this.rsvpdSlides.filter(slide => slide.startDate === this.selectedDate);
    } else {
   
      this.rsvpdSlides = [...this.allRsvpdSlides];
    }
  }
  

  clearDate(dateInput: HTMLInputElement): void {
    this.selectedDate = '';
    dateInput.value = '';
    this.updateFilteredRsvpdSlides();
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


  async checkCookies() {
    // Get all cookies
    const cookies = document.cookie.split('; ');

    // Find the cookie by name
    let accessToken = null;
    let refreshToken = null;
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === "jwt") {
            accessToken = decodeURIComponent(value);
            break;
        }
    }
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === "refresh") {
          refreshToken = decodeURIComponent(value);
          break;
      }
  }
    
    if(!accessToken)        //If access token expired
    {
      if(!refreshToken)     //If refresh token expired
      {
        this.router.navigate(["/login"]);
      }

      try {
        const response = await fetch("https://events-system-back.wn.r.appspot.com/api/v1/auth/refresh-token", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getCookie("refresh")}`
            },
            body: JSON.stringify(FormData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const authData = await response.json();
        document.cookie = `jwt=${authData.access_token}; path=/; expires=` + new Date(new Date().getTime() + 15 * 60 * 1000).toUTCString();
        document.cookie = `refresh=${authData.refresh_token}; path=/; expires=` + new Date(new Date().getTime() + 24* 60 * 60 * 1000).toUTCString();
        console.log('Token refresh successful');
        // Handle the response data as needed
      } catch (error) {
          console.error('Error refreshing token');
          // Handle errors appropriately
      }
    }
  }


  getCookie(cookieName: string) {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}



}
