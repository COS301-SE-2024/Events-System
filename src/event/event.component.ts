import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RandomHeaderService } from '../app/random-header.service';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
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
export class EventComponent implements OnInit{
  imageSource: string;
  eventId= '';
  event: any = null;
  host: any = null;
  isLoading = true;
  hasUserRSVPd = false;
  googleSignIn = false;
  club: any = null;
  constructor(private route: ActivatedRoute, private randomHeaderService: RandomHeaderService) { 
    this.imageSource = '';
  }
  goBack(): void {
    window.history.back();
  }
  ngOnInit(): void {
    this.imageSource = this.randomHeaderService.getRandomHeaderSource();
    this.route.params.subscribe(async params => { // Step 1: Make this an async function
      this.eventId = params['id'];
  
      await this.checkUserRSVP();
      await this.fetchEventDetails();
    });
    this.googleSignIn = Boolean(localStorage.getItem('googleSignIn'));
  }
  
  async fetchEventDetails(): Promise<void> {
    try {
      const eventResponse = await fetch('https://events-system-back.wn.r.appspot.com/api/events/' + this.eventId);
      const eventData = await eventResponse.json();
      this.event = eventData;
      this.event.startTime = this.formatTime(this.event.startTime);
      this.event.endTime = this.formatTime(this.event.endTime);
  
      const hostResponse = await fetch('https://events-system-back.wn.r.appspot.com/api/employees/' + this.event.hostId);
      const hostData = await hostResponse.json();
      this.host = hostData;
  
      const clubResponse = await fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + this.event.socialClub);
      const clubData = await clubResponse.json();
      this.club = clubData;
  
      this.isLoading = false; // Indicate loading is complete
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  }
  matchingEventId: number | null = null; // New property to store the matching eventId
  matchingRsvpId: number | null = null; // New property to store the matching rsvpId

  
  async checkUserRSVP(): Promise<void> {
    const employeeId = localStorage.getItem('ID');
    if (!employeeId) return;
    console.log("employeeID", employeeId);
    console.log("eventID", this.eventId);

    try {
      const response = await fetch('https://events-system-back.wn.r.appspot.com/api/event-rsvps');
      const rsvps = await response.json();
      
      const matchingRSVP = rsvps.find((rsvp: any) => parseInt(rsvp.eventId) === parseInt(this.eventId) && rsvp.employeeId === parseInt(employeeId));
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

      // Get all cookies
      const cookies = document.cookie.split('; ');

      // Find the cookie by name
      let googleToken = null;
      for (const cookie of cookies) {
          const [name, value] = cookie.split('=');
          if (name === "google") {
              googleToken = decodeURIComponent(value);
              break;
          }
      }

      if(googleToken) {
        const now = new Date().toISOString();
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=50&timeMin=${encodeURIComponent(now)}&orderBy=startTime&singleEvents=true`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${googleToken}`,
            "Content-Type": "application/json",
          },
        })
        .then(response => response.json())
        .then(async data => {
          // Find the event with the matching eventId in extendedProperties.private
          const matchingEvent = data.items.find((event: any) => 
            event.extendedProperties?.private?.eventId.toString() === this.eventId
          );
          
          if (matchingEvent) {
            // Proceed to delete the event
            await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${matchingEvent.id}`, {
              method: 'DELETE',
              headers: {
                "Authorization": `Bearer ${googleToken}`,
                "Content-Type": "application/json",
              },
            })
            .then(() => {
                console.log('Event deleted successfully');
            })
            .catch(error => {
              console.error('Error:', error.message);
            });
          } else {
            //console.log('Event not found');
          }
        })
        .catch(error => {
          console.error('Error:', error.message);
        });
      }
    } else {
      this.isAPILoading = true;
      const requestBody = {
        eventId: this.eventId,
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

        if(this.googleSignIn)
        {
          // Get all cookies
          const cookies = document.cookie.split('; ');

          // Find the cookie by name
          let googleToken = null;
          for (const cookie of cookies) {
              const [name, value] = cookie.split('=');
              if (name === "google") {
                  googleToken = decodeURIComponent(value);
                  break;
              }
          }

          if(googleToken)
          {
            await fetch(`https://events-system-back.wn.r.appspot.com/api/events/${this.eventId}`, {
              method: 'GET',
              credentials: "include",
              headers: {
                'Content-Type': 'application/json',
              }
            })
            .then(async eventData => {
              const event = await eventData.json();
              const agendas = `<ul>${event.eventAgendas.map((agenda: any) => `<li>${agenda}</li>`).join("")}</ul>`
              const preps = `<ul>${event.eventPreparation.map((preparation: any) => `<li>${preparation}</li>`).join("")}</ul>`
              const googleEvent = {
                summary: event.title,
                location: event.location,
                description: `
                  ${event.description}
                  <h3>Agenda:</h3>  ${agendas}



              <h3>Preparation Details:</h3>  ${preps}

                `,
                start: {
                  dateTime: `${event.startDate}T${event.startTime}`,
                  timeZone: 'Africa/Johannesburg', // Adjust based on your timezone
                },
                end: {
                  dateTime: `${event.endDate}T${event.endTime}`,
                  timeZone: 'Africa/Johannesburg', // Adjust based on your timezone
                },
                extendedProperties: {
                  private: {
                    eventId: event.eventId.toString(),
                    hostId: event.hostId.toString(),
                    socialClub: event.socialClub.toString(),
                  },
                },
                source: {
                  url: event.eventPictureLink,
                  title: 'Event Picture',
                },
                reminders: {
                  useDefault: false,
                  overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 10 },
                  ],
                },
              };

              await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'POST',
                headers: {
                  "Authorization": `Bearer ${googleToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(googleEvent),
              })
            })
          }
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