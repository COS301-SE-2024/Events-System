import { Component, Input, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {HomeEventCardComponent} from 'src/Components/HomeEventCard/HomeEventCard.component'
import {HomeFeaturedEventComponent} from 'src/Components/HomeFeaturedEvent/HomeFeaturedEvent.component'
import {SocialClubCardComponent} from 'src/Components/SocialClubCard/socialClubCard.component'
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { SocialClubCardSkeletonComponent } from 'src/Components/SocialClubCardSkeleton/SocialClubCardSkeleton.component';
import { HomeUpcomingSkeletonComponent } from 'src/Components/HomeUpcomingSkeleton/HomeUpcomingSkeleton.component';
import { WebSocketService } from 'src/app/websocket.service';
import { NotificationService } from 'src/app/notification.service';
import { RandomHeaderService } from 'src/app/random-header.service';
import { ChatbotComponent } from 'src/Components/chatbot/chatbot.component';
import { TourService } from './tour.service'; // Import the TourService
import { ActivatedRoute } from '@angular/router';
// import 'shepherd.js/dist/css/shepherd.css';
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
  tags: any;
  host: any; // replace 'any' with the actual type of 'host'
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HomeEventCardComponent, SocialClubCardComponent, HomeFeaturedEventComponent, HomeUpcomingSkeletonComponent, SocialClubCardSkeletonComponent, ChatbotComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [WebSocketService],
})
export class HomeComponent implements OnInit {
  public notifications = 0;
  @ViewChild('toastContainer', { static: true }) toastContainer!: ElementRef;
  imageSource: string;


  constructor(private cdr: ChangeDetectorRef, 
    private router: Router,
    //  private webSocketService: WebSocketService,
      private notificationService: NotificationService,
      private tourService: TourService, // Inject the TourService
      private randomHeaderService: RandomHeaderService,
    private route: ActivatedRoute) { 
        this.imageSource = '';
	// 	// Open connection with server socket
  //   const stompClient = this.webSocketService.connect();
  //   stompClient.connect({}, (frame : any) => {

  // // Subscribe to notification topic
  //       stompClient.subscribe('/topic/notification', notifications => {

  //   // Update notifications attribute with the recent messsage sent from the server
  //           this.notifications = JSON.parse(notifications.body).count;
  //       })
  //   });
    }
notify() {
  this.notificationService.sendNotification(Number(localStorage.getItem('ID')), 93, "tesst", "title").subscribe(response => {
    console.log(response); // Handle the response as needed
  });

}
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
  showToast(message: string) {
      this.notificationService.notify();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="alert alert-info">
        <span>${message}</span>
      </div>
    `;
    this.toastContainer.nativeElement.appendChild(toast);

    // Remove the toast after a few seconds
    setTimeout(() => {
      this.toastContainer.nativeElement.removeChild(toast);
    }, 3000);
}
ngOnInit() {
  this.route.queryParams.subscribe(params => {
    if (params['startTour'] === 'true') {
        this.startTour();
                  // Remove 'startTour' from query params
        const url = new URL(window.location.href);
        url.searchParams.delete('startTour');
        window.history.replaceState({}, '', url.toString());
        
      }
  });

  this.imageSource = this.randomHeaderService.getRandomHeaderSource();
  const employeeId = Number(localStorage.getItem('ID'));

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
      const now = new Date();

      this.slides = this.events
        .filter(eventData => new Date(eventData.startDate) > now)
        .map((eventData, index) => {
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
            tags: eventData.tags,
            host: eventData.host
          };
          this.cdr.detectChanges();
          return slide;
        });

      this.allSlides = [...this.slides];

      fetch('https://events-system-back.wn.r.appspot.com/api/event-rsvps')
        .then(response => response.json())
        .then(data => {
          const rsvps = Array.isArray(data) ? data : [data];

          const rsvpCounts = rsvps.reduce((counts, rsvp) => {
            counts[rsvp.eventId] = (counts[rsvp.eventId] || 0) + 1;
            return counts;
          }, {});

          const sortedSlides = [...this.slides].sort((a, b) => (rsvpCounts[b.id] || 0) - (rsvpCounts[a.id] || 0));
          this.Homeslides = JSON.parse(JSON.stringify(sortedSlides.slice(0, 10)));

          const eventIds = rsvps.filter(rsvp => rsvp.employeeId === employeeId).map(rsvp => rsvp.eventId);
          this.rsvpdSlides = this.slides.filter(slide => eventIds.includes(slide.id));
          this.allRsvpdSlides = this.slides.filter(slide => eventIds.includes(slide.id));

          // Sort rsvpdSlides by startDate
          this.rsvpdSlides.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
          this.allRsvpdSlides.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

          this.isLoading = false;
        });
    })
    .catch(error => {
      console.error('Error:', error);
    });

    // Auto-start the tour if it's the user's first time
    if (!localStorage.getItem('dontShowTour')) {
      this.startTour();
    }

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
  startTour(){
    this.tourService.startTour();
  }
}
