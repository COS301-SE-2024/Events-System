import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RandomHeaderService } from '../app/random-header.service';
import { EventCardComponent } from 'src/Components/EventCard/eventCard.component';
import { GhostEventCardComponent } from 'src/Components/GhostEventCard/GhostEventCard.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [CommonModule, RouterModule, EventCardComponent, GhostEventCardComponent],
  templateUrl: './series.component.html',
  styleUrl: './series.component.css',
  animations: [
    trigger('buttonFade', [
      state('notRSVPd', style({
        opacity: 1,
      })),
      state('RSVPd', style({
        opacity: 1,
      })),
      transition('notRSVPd => RSVPd', [
        animate('1.5s', style({ opacity: 0 })),
        animate('1.5s', style({ opacity: 1 }))
      ]),
      transition('RSVPd => notRSVPd', [
        animate('1.5s', style({ opacity: 0 })),
        animate('1.5s', style({ opacity: 1 }))
      ]),
    ]),
  ]
})
export class SeriesComponent implements OnInit{
  imageSource: string;
  isLoading = true;
  seriesID= '';
  series: any = {
    host: {
      firstName: '',
      lastName: ''
    }
  };
  activeTab = 'tab1';
  events: any[] = [];
  hasUserRSVPd = false;
  goBack(): void {
    window.history.back();
  }
  constructor(private route: ActivatedRoute, private randomHeaderService: RandomHeaderService) { 
    this.imageSource = '';
  }
  ngOnInit(): void {
    this.imageSource = this.randomHeaderService.getRandomHeaderSource();
    this.route.params.subscribe(async params => {
      this.seriesID = params['id'];
      await this.checkUserRSVP();
      await this.fetchEventDetails();
      // Fetch series data and host data in parallel

    });
  }

  async fetchEventDetails(): Promise<void> {
    const seriesFetch = fetch('https://events-system-back.wn.r.appspot.com/api/eventseries/' + this.seriesID)
    .then(response => response.json());

  seriesFetch.then(data => {
    this.series = data;

    // Fetch host data for the series
    const seriesHostFetch = fetch('https://events-system-back.wn.r.appspot.com/api/employees/' + this.series.hostId)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.series.host = data; // Add host data to the series
      });

    // Fetch event details for each event ID
    const eventPromises = this.series.seriesEventIds.map((eventId: number) =>
      fetch('https://events-system-back.wn.r.appspot.com/api/events/' + eventId)
        .then(response => response.json())
    );

    Promise.all([seriesHostFetch, ...eventPromises]).then(results => {
      const [_, ...events] = results;
      this.events = events;
      console.log(this.events);

      // Fetch host information for each event
      const hostFetches = this.events.map(event => {
        return fetch('https://events-system-back.wn.r.appspot.com/api/employees/' + event.hostId)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse the response as JSON
          })
          .then(data => {
            console.log("host:", data); // Log the parsed data
            event.host = data; // Add host data to the event
          })
          .catch(error => {
            console.error('Error fetching host data:', error);
          });
      });
      Promise.all(hostFetches).then(() => {
        // All host information has been fetched and added to events
        this.isLoading = false;
      });
    });
  });
  }

  async checkUserRSVP(): Promise<void> {
    const employeeId = localStorage.getItem('ID');
    if (!employeeId) return;
    console.log("employeeID", employeeId);
    console.log("seriesID", this.seriesID);

    try {
      const response = await fetch('https://events-system-back.wn.r.appspot.com/api/eventseriessubscriptions');
      const rsvps = await response.json();
      
      const matchingRSVP = rsvps.find((rsvp: any) => parseInt(rsvp.seriesId) === parseInt(this.seriesID) && rsvp.employeeId === parseInt(employeeId));
      this.hasUserRSVPd = !!matchingRSVP.subscriptionId; 

      if (matchingRSVP) {
        this.matchingEventId = parseInt(matchingRSVP.seriesId); // Store the matching eventId
        this.matchingRsvpId = parseInt(matchingRSVP.subscriptionId); // Store the matching rsvpId
      } else {
        this.matchingEventId = null; // Reset if no match is found
        this.matchingRsvpId = null; // Reset if no match is found
      }
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
    }
  }
  isAPILoading = false;
  showrsvpsuccessToast = false;
  showrsvpfailToast = false;
  matchingEventId: number | null = null; // New property to store the matching eventId
  matchingRsvpId: number | null = null; // New property to store the matching rsvpId
  showunrsvpsuccessToast = false;
  showunrsvpfailToast = false;
    // Method to toggle RSVP state and perform booking/canceling
    async rsvpToSeries() : Promise<void>{
      if (this.hasUserRSVPd) {
        // Logic to cancel the booking
        this.isAPILoading = true;
        console.log('Cancelling RSVP:', this.matchingRsvpId);
        fetch('https://events-system-back.wn.r.appspot.com/api/eventseriessubscriptions/' + this.matchingRsvpId, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: '{}'
        })
        .then(() => {
          // Show the success toast
          this.showunrsvpsuccessToast = true;
          this.isAPILoading = false;
          // Hide the toast after 5 seconds
          setTimeout(() => {
            this.showunrsvpsuccessToast = false;
          }, 5000);
        })
        .catch((error) => {
          this.showunrsvpfailToast = true;
          this.isAPILoading = false;
          setTimeout(() => {
            this.showunrsvpfailToast = false;
          }, 5000);
          console.error('Error:', error);
        });
      } else {
        this.isAPILoading = true;
        const requestBody = {
          seriesId: this.seriesID,
          employeeId: localStorage.getItem('ID'),
        };
      
        try {
          const response = await fetch('https://events-system-back.wn.r.appspot.com/api/eventseriessubscriptions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
      
          if (!response.ok) {
            throw new Error('Failed to RSVP to series');
          }
      
          const responseData = await response.json();
          this.showrsvpsuccessToast = true;
          this.isAPILoading = false;
          console.log('RSVP successful:', responseData);
          setTimeout(() => {
            this.showrsvpsuccessToast = false;
          }, 5000);
    
        } catch (error) {
          this.showrsvpfailToast = true;
          this.isAPILoading = false;
          setTimeout(() => {
            this.showrsvpfailToast = false;
          }, 10000);
          console.error('Error RSVPing to event:', error);
          // Handle error
        }
      }
      this.hasUserRSVPd = !this.hasUserRSVPd; // Toggle the RSVP state
    }
  
}