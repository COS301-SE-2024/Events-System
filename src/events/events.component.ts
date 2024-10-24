import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from 'src/Components/event/event.component';
import { EventCardComponent } from 'src/Components/EventCard/eventCard.component';
import { GhostEventCardComponent } from 'src/Components/GhostEventCard/GhostEventCard.component';
import { EventsTourService } from './Eventstour.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, EventComponent, EventCardComponent, GhostEventCardComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
  
})

export class EventsComponent implements OnInit{
  @ViewChild('eventContainer') eventContainer!: ElementRef;
  showRecommended = false;
  recommendedEvents: any[] = [];
  events: any[] = [];
  host: any = null;
  selectedDate = '';
  searchLocation = '';
  loading = false;
  searchTerm = '';
  uniqueSocialClubs: any[] = [];
  checkedSocialClubs: any[] = [];
  filteredEvents = this.events;
  isLoading = true;
  event = {
    eventId: '',
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
    startDate: '',
    endDate: '',
    location: '',
    hostId: '',
    geolocation: '',
    socialClub: '',
    host: '',
    eventAgendas: '',
    eventDietaryAccommodations: ''
  };
  allClubsChecked = false;
  otherCheckboxes: boolean[] = [];
  selectedDietaryAccommodation = '';
  socialClubs: any[] = [];
  recommendedEventIds: string[] = [];
  showClearButton = false;
  showSuggestButton = false; // New property
  reloaded = false;
  constructor(private eventsTourService: EventsTourService, private route: ActivatedRoute) {} // Inject the EventsTourService

  onSubmit() {
    const dateInput = (<HTMLInputElement>document.getElementById('date-input')).value;
    // console.log(dateInput);
    // You can now use the dateInput value for your needs
    this.selectedDate = dateInput;
    this.onDateChange();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['startTour'] === 'true') {
        if (!sessionStorage.getItem('tourReloaded')) {
          sessionStorage.setItem('tourReloaded', 'true');
          window.location.reload();
        } else {
          sessionStorage.removeItem('tourReloaded');
          this.startTour();
        
          // Remove 'startTour' from query params
        const url = new URL(window.location.href);
        url.searchParams.delete('startTour');
        window.history.replaceState({}, '', url.toString());
        }
      }
    });

    fetch('https://events-system-back.wn.r.appspot.com/api/events')
      .then(response => {
        return response.json();
      })
      .then(data => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set the time to the start of the day
  
        this.events = (Array.isArray(data) ? data : [data]).filter(event => {
          const eventDate = new Date(event.startDate);
          eventDate.setHours(0, 0, 0, 0); // Set the time to the start of the day
          return eventDate >= now;
        });

        // Store the eventID of the first event in sessionStorage
        if (this.events.length > 0) {
          sessionStorage.setItem('firstEventID', this.events[0].eventId);
        }

        this.uniqueSocialClubs = [...new Set(this.events.map(event => event.socialClub))];
        this.otherCheckboxes = new Array(this.uniqueSocialClubs.length).fill(false);
        this.filterEvents();
  
        // Fetch host information for each event
        const hostFetches = this.events.map(event => {
          return fetch('https://events-system-back.wn.r.appspot.com/api/employees/' + event.hostId)
            .then(response => {
              return response.json();
            })
            .then(data => {
              event.host = data; // Add host data to the event
            });
        });
  
        // Fetch social club information for each unique social club
        const socialClubFetches = this.uniqueSocialClubs.map(socialClubId => {
          return fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + socialClubId)
            .then(response => {
              return response.json();
            })
            .then(data => {
              if (data) { // Check if data is not null
                // Store the social club data in a property of the component
                this.socialClubs.push(data);
                this.uniqueSocialClubs = [...new Set(this.socialClubs.map(club => club))];
                this.otherCheckboxes = new Array(this.uniqueSocialClubs.length).fill(false);
              }
            });
        });
  
        // Wait for all host fetches to complete before ending the loading state
        Promise.all([...hostFetches, ...socialClubFetches]).then(() => {
          this.isLoading = false;
        });
      });
  
    // Slide in the "Suggest some events" button after a delay
    setTimeout(() => {
      this.showSuggestButton = true;
    }, 2000); // 2 seconds delay
  }

  onOtherClubClick(i: number) {
    const club = this.uniqueSocialClubs[i];
    if (this.otherCheckboxes[i]) {
      this.checkedSocialClubs.push(club);
    } else {
      const index = this.checkedSocialClubs.indexOf(club);
      if (index > -1) {
        this.checkedSocialClubs.splice(index, 1);
      }
    }
    console.log(this.checkedSocialClubs);
    this.filterEvents();
    if (this.otherCheckboxes[i]) {
      this.allClubsChecked = false;
    }
  }
  onAllClubsClick() {
    if (this.allClubsChecked) {
      this.otherCheckboxes = this.otherCheckboxes.map(() => false);
      this.checkedSocialClubs = [];
    } else {
      this.checkedSocialClubs = [...this.uniqueSocialClubs];     
    }
    this.filterEvents();
  }

  filterEvents() {  
    // Step 1: Extract IDs from checkedSocialClubs
    const checkedSocialClubsIds = this.checkedSocialClubs.map(club => club.id);
  
    if (checkedSocialClubsIds.length > 0) {
      this.filteredEvents = this.events.filter(event => 
        // Step 2: Use the extracted IDs for comparison
        checkedSocialClubsIds.includes(event.socialClub) &&
        (!this.selectedDate || new Date(event.startDate).toDateString() === new Date(this.selectedDate).toDateString()) &&
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        event.location.toLowerCase().includes(this.searchLocation.toLowerCase()) &&
        (!this.selectedDietaryAccommodation || event.eventDietaryAccommodations.includes(this.selectedDietaryAccommodation))
      );  
    } else {
      this.filteredEvents = this.events.filter(event => 
        (!this.selectedDate || new Date(event.startDate).toDateString() === new Date(this.selectedDate).toDateString()) &&
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        event.location.toLowerCase().includes(this.searchLocation.toLowerCase()) &&
        (!this.selectedDietaryAccommodation || event.eventDietaryAccommodations.includes(this.selectedDietaryAccommodation))
      );
    }
  }
  handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.selectedDate = target.value;
      this.onDateChange();
    }
  }
  // selectSocialClub(socialClub: string) {
  //   this.filteredEvents = this.events.filter(event => event.socialClub === socialClub);
  // }
  

  updateSearchTerm(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target?.value || '';
    this.filterByTitle();
  }
  updateSearchLocation(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchLocation = target?.value || '';
    this.filterEvents();
  }
  updateDietaryAccommodation(accommodation: string) {
    this.selectedDietaryAccommodation = accommodation;
    this.filterEvents();
  }


  clearDateFilter() {
    this.selectedDate = '';
    this.filterEvents(); // reapply filters after clearing date filter
  }
  onDateChange() {
    if (this.selectedDate) {
      this.filteredEvents = this.events.filter(event => new Date(event.startDate).toDateString() === new Date(this.selectedDate).toDateString());
    } else {
      this.filteredEvents = this.events;
    }
  }
  filterByTitle() {
    this.filteredEvents = this.events.filter(event => 
      event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      event.location.toLowerCase().includes(this.searchLocation.toLowerCase()) &&
      (!this.selectedDietaryAccommodation || event.eventDietaryAccommodations.includes(this.selectedDietaryAccommodation))
    );
  }

  highlightRecommendedEvents() {
    this.showRecommended = true; // Show the recommended events overlay
    this.loading = true;
    this.showClearButton = true; // Show the "X" button

    const employeeId = localStorage.getItem('ID');
    fetch(`https://capstone-middleware-178c57c6a187.herokuapp.com/recommend?user_id=${employeeId}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        this.recommendedEventIds = data;
        this.recommendedEvents = this.events.filter(event => this.recommendedEventIds.includes(event.eventId));
        // this.filterEvents();
        this.loading = false;
        // this.scrollToFirstRecommendedEvent();
      });
  }

  scrollToFirstRecommendedEvent() {
    setTimeout(() => {
      const firstRecommendedEvent = this.eventContainer.nativeElement.querySelector('.recommended');
      if (firstRecommendedEvent) {
        firstRecommendedEvent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  clearRecommendedEvents() {
    this.recommendedEventIds = [];
    this.filterEvents();
    this.showRecommended = false; // Hide the recommended events overlay
    this.showClearButton = false; // Hide the "X" button
  }

  startTour(){
    this.eventsTourService.startTour();
  }
}