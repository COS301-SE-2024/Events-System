import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RandomImageServiceService } from '../../app/random-image-service.service'; 

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './eventCard.component.html',
  styleUrl: './eventCard.component.css',
})
export class EventCardComponent implements OnChanges, OnInit {
  imageSource: string;
  loading = true; // Add loading state

  // Inject RandomImageService into the constructor
  constructor(private randomImageService: RandomImageServiceService) {
    this.imageSource = '';
  }

  @Input() eventID: string | undefined;
  @Input() eventTitle: string | undefined;
  @Input() description: string | undefined;
  @Input() startTime: string | undefined;
  @Input() endTime: string | undefined;
  @Input() startDate: string | undefined;
  @Input() endDate: string | undefined;
  @Input() location: string | undefined;
  @Input() hostedBy: string | undefined;
  @Input() socialClub: string | undefined;
  @Input() isRecommended = false; // Add this line
  hasUserRSVPd = false;

  formatTime(time: string | undefined): string | undefined {
    if (time) {
      const parts = time.split(':');
      return parts[0] + ':' + parts[1];
    }
    return undefined;
  }

  isSameDate(): boolean {
    return this.startDate === this.endDate;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startTime']) {
      this.startTime = this.formatTime(this.startTime);
    }
    if (changes['endTime']) {
      this.endTime = this.formatTime(this.endTime);
    }
  }

  ngOnInit(): void {
    // Use the injected service
    this.imageSource = this.randomImageService.getRandomImageSource();
    this.checkUserRSVP();
  }

  matchingEventId: number | null = null; // New property to store the matching eventId
  matchingRsvpId: number | null = null; // New property to store the matching rsvpId

  async checkUserRSVP(): Promise<void> {
    const employeeId = localStorage.getItem('ID');
    if (!employeeId) return;
    console.log("employeeID", employeeId);
    console.log("eventID", this.eventID);

    try {
      const response = await fetch('https://events-system-back.wn.r.appspot.com/api/event-rsvps');
      const rsvps = await response.json();
      
      const matchingRSVP = rsvps.find((rsvp: any) => 
        parseInt(rsvp.eventId) === parseInt(this.eventID ?? '') && 
        rsvp.employeeId === parseInt(employeeId ?? '')
      );
      this.hasUserRSVPd = !!matchingRSVP?.rsvpId;

      if (matchingRSVP) {
        this.matchingEventId = parseInt(matchingRSVP.eventId); // Store the matching eventId
        this.matchingRsvpId = parseInt(matchingRSVP.rsvpId); // Store the matching rsvpId
      } else {
        this.matchingEventId = null; // Reset if no match is found
        this.matchingRsvpId = null; // Reset if no match is found
      }
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
    } finally {
      this.loading = false; // Set loading to false once data is processed
    }
  }
}