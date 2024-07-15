import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from 'src/Components/SearchTag/tag.component';
import { RouterModule } from '@angular/router';
import { RandomHeaderService } from '../../app/random-header.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-search-event-card',
  standalone: true,
  imports: [CommonModule, TagComponent, RouterModule],
  templateUrl: './searchEventCard.component.html',
  styleUrl: './searchEventCard.component.css',
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
export class SearchEventCardComponent implements OnInit{
  imageSource: string;
  constructor(private randomHeaderService: RandomHeaderService) { 
    this.imageSource = '';
  }
  isLoading = true;
  hasUserRSVPd = false;
  @Input() eventTitle: string | undefined;
  @Input() hostName: string | undefined;
  @Input() hostEmail: string | undefined;
  @Input() startTime: string | undefined;
  @Input() endTime: string | undefined;
  @Input() startDate: string | undefined;
  @Input() endDate: string | undefined;
  @Input() hostedBy: string | undefined;
  @Input() eventDescription: string | undefined;
  @Input() eventID: string | undefined;
  @Input() location: string | undefined;
  @Input() socialClub: string | undefined;
  get formattedStartTime() {
    return this.startTime?.slice(0, -3);
  }

  get formattedEndTime() {
    return this.endTime?.slice(0, -3);
  }
  matchingEventId: number | null = null; // New property to store the matching eventId
  matchingRsvpId: number | null = null; // New property to store the matching rsvpId

  ngOnInit(): void {
    this.imageSource = this.randomHeaderService.getRandomHeaderSource();
    this.checkUserRSVP();
  }
  async checkUserRSVP(): Promise<void> {
    const employeeId = localStorage.getItem('ID');
    if (!employeeId) return;
    console.log("employeeID", employeeId);
    console.log("eventID", this.eventID);

    try {
      const response = await fetch('https://events-system-back.wn.r.appspot.com/api/event-rsvps');
      const rsvps = await response.json();
      
      const matchingRSVP = rsvps.find((rsvp: any) => parseInt(rsvp.eventId) === parseInt(this.eventID ?? '') && rsvp.employeeId === parseInt(employeeId));
      this.hasUserRSVPd = !!matchingRSVP.rsvpId;

      if (matchingRSVP) {
        this.matchingEventId = parseInt(matchingRSVP.eventId); // Store the matching eventId
        this.matchingRsvpId = parseInt(matchingRSVP.rsvpId); // Store the matching rsvpId
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

  showunrsvpsuccessToast = false;
  showunrsvpfailToast = false;

  // Method to toggle RSVP state and perform booking/canceling
  async rsvpToEvent() : Promise<void>{
    if (this.hasUserRSVPd) {
      // Logic to cancel the booking
      this.isAPILoading = true;
    
      fetch('https://events-system-back.wn.r.appspot.com/api/event-rsvps/' + this.matchingRsvpId, {
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
        eventId: this.eventID,
        employeeId: localStorage.getItem('ID'),
        status: 'reserved'
      };
    
      try {
        const response = await fetch('https://events-system-back.wn.r.appspot.com/api/event-rsvps', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
    
        if (!response.ok) {
          throw new Error('Failed to RSVP to event');
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
