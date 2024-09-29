import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MyscheduleCardComponent } from 'src/Components/MyscheduleCard/MyscheduleCard.component';

@Component({
  selector: 'app-my-schedule',
  standalone: true,
  imports: [CommonModule, MyscheduleCardComponent],
  templateUrl: './MySchedule.component.html',
  styleUrls: ['./MySchedule.component.css'],
  

})
export class MyScheduleComponent implements OnInit {
  rsvpdSlides: any[] = [];
  allRsvpdSlides: any[] = [];
  slides: any[] = [];
  events: any[] = [];
  groupedEvents: { [key: string]: any[] } = {};
  allrsvps: any[] = [];
  activeTab = 1; // Default to Tab 1
  userRole = '';
  loading = true;
  selectTab(tabIndex: number) {
    this.activeTab = tabIndex;
  }

  getTabPosition(): string {
    if (this.userRole === 'MANAGER') {
      switch (this.activeTab) {
        case 1:
          return '0%';
        case 2:
          return '33.33%';
        case 3:
          return '66.66%';
        default:
          return '0%';
      }
    } else {
      switch (this.activeTab) {
        case 1:
          return '0%';
        case 2:
          return '50%';
        default:
          return '0%';
      }
    }
  }

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    const employeeId = Number(localStorage.getItem('ID')); // Assuming the employeeId is stored in local storage
    fetch('https://events-system-back.wn.r.appspot.com/api/employees/' + employeeId, {
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
        this.userRole = data.role;
      })
      .catch(error => {
        console.error('Error:', error);
      }
    )
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
            // console.log(data);
            event.host = data;
          }));

        return Promise.all(hostFetches);
      })
      .then(() => {
        // Sort events in chronological order
        this.events.sort((a, b) => {
          const dateA = new Date(`${a.startDate}T${a.startTime}`);
          const dateB = new Date(`${b.startDate}T${b.startTime}`);
          return dateA.getTime() - dateB.getTime();
        });
        
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
            eventDietaryAccommodations: eventData.eventDietaryAccommodations,
            eventPreparation: eventData.eventPreparation,
            geolocation: eventData.geolocation,
            socialClub: eventData.socialClub,
            tags: eventData.tags,
            host: eventData.host,
          };
          this.cdr.detectChanges();
          return slide;
        });

        // Group events by month and year
        this.groupEventsByMonthAndYear();

        // Fetch RSVPs and filter slides
        return fetch('https://events-system-back.wn.r.appspot.com/api/event-rsvps');
      })
      .then(response => response.json())
      .then(data => {
        this.allrsvps = Array.isArray(data) ? data : [data];
        const rsvps = Array.isArray(data) ? data : [data];

        // Filter slides based on the current user's RSVP'd events for RSVP'd slides
        const eventIds = rsvps.filter(rsvp => rsvp.employeeId === employeeId).map(rsvp => rsvp.eventId);
        this.rsvpdSlides = this.slides.filter(slide => eventIds.includes(slide.id));
        this.allRsvpdSlides = this.slides.filter(slide => eventIds.includes(slide.id));
      })
      .finally(() => {
        this.loading = false; // Set loading to false once data fetching is complete
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  getHostedEvents(): { [key: string]: any[] } {
    const employeeId = Number(localStorage.getItem('ID')); // Assuming the employeeId is stored in local storage
    const hostedEvents = this.events.filter(event => event.hostId === employeeId);
    return hostedEvents.reduce((acc: { [key: string]: any[] }, event) => {
      const date = new Date(event.startDate);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(event);
      return acc;
    }, {});
  }

  groupEventsByMonthAndYear() {
    this.groupedEvents = this.slides.reduce((acc, event) => {
      const date = new Date(event.startDate);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(event);
      return acc;
    }, {});
  }

  getGroupedEventKeys(): string[] {
    return Object.keys(this.groupedEvents).filter(key => this.groupedEvents[key].length > 0);
  }

  getFormattedTime(dayeString: string): string {
    return dayeString.slice(0, 3);
  }

  
  getUpcomingEvents(): { [key: string]: any[] } {
    const now = new Date();
    const employeeId = Number(localStorage.getItem('ID')); // Assuming the employeeId is stored in local storage
  
    return Object.keys(this.groupedEvents).reduce((acc: { [key: string]: any[] }, key: string) => {
      const events = this.groupedEvents[key].filter(event => {
        const isUpcoming = new Date(`${event.startDate}T${event.startTime}`) >= now;
        const isAttending = this.allrsvps.some(rsvp => rsvp.eventId === event.id && rsvp.employeeId === employeeId);
        const isHosting = event.hostId === employeeId;
        return isUpcoming && (isAttending || isHosting);
      });
      if (events.length) {
        acc[key] = events;
      }
      return acc;
    }, {});
  }
  
  getPastEvents(): { [key: string]: any[] } {
    const now = new Date();
    return Object.keys(this.groupedEvents).reduce((acc: { [key: string]: any[] }, key: string) => {
      const events = this.groupedEvents[key].filter(event => new Date(`${event.startDate}T${event.startTime}`) < now);
      if (events.length) {
        acc[key] = events;
      }
      return acc;
    }, {});
  }
}