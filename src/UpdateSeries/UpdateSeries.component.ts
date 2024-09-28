import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Location } from '@angular/common';
import validator from 'validator';
import { RouterModule } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';

import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { SanitizePipe } from 'src/app/sanitization.pipe';
@Component({
  selector: 'app-update-series',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './UpdateSeries.component.html',
  styleUrl: './UpdateSeries.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('10ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0 })),
      ]),
    ]),
  ]
})
export class UpdateSeriesComponent {

  @ViewChildren('stepInput') stepInputs!: QueryList<ElementRef>;
  @ViewChild('snameInput') snameInput!: ElementRef;
  @ViewChild('sdescriptionInput') sdescriptionInput!: ElementRef;
  // Define the Prepinputs and Agendainputs as an array of objects
  seriesId= '';
  myseries: any = null;
  host: any = null;
  isLoading = true;
  isAPILoading = false;
  showsuccessToast = false;
  showfailToast = false;
  selectedEventIds: number[] = [];
  allEventsSelected = false;
  sanitizePipe: SanitizePipe;

  events: any[] = [];
  uniqueSocialClubs: any[] = [];
  checkedSocialClubs: any[] = [];
  allClubsChecked = false;
  socialClubs: any[] = [];
  otherCheckboxes: boolean[] = [];
  loading = true;
  constructor(private route: ActivatedRoute, private location: Location, private fb: FormBuilder, private notificationService: NotificationService, private sanitizer: DomSanitizer) {
    this.sanitizePipe = new SanitizePipe(this.sanitizer);

   }  goBack(): void {
    window.history.back();
  }
presubmit(){
  const missingDetails = [];

  if (!sessionStorage.getItem('sName') || sessionStorage.getItem('sName') === '') {
    missingDetails.push('title');
  }
  if (!sessionStorage.getItem('sDescription') || sessionStorage.getItem('sDescription') === '') {
    missingDetails.push('Description');
  }
  
  if (missingDetails.length > 0) {
    alert('Please fill in the following details: ' + missingDetails.join(', '));
    return;
  }else{
    this.submit();
  }
}
  submit(){
    this.isAPILoading = true; // Set isLoading to true at the start of the method

    this.route.params.subscribe(params => {
      this.seriesId = params['id'];
      const series = {
        name: this.sanitizePipe.transform(this.snameInput.nativeElement.value),
        description: this.sanitizePipe.transform(this.sdescriptionInput.nativeElement.value),
        seriesEventIds: JSON.parse(sessionStorage.getItem('sselectedEventIds') || '[]'),
      };
      // Send the POST request
      fetch('https://events-system-back.wn.r.appspot.com/api/eventseries/' + this.seriesId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(series)
      })
      .then(response => response.json())
      .then(data => {
          // Show the success toast
          this.notify();

          this.showsuccessToast = true;
          this.isAPILoading = false;
          // Hide the toast after 5 seconds
          setTimeout(() => {
            this.showsuccessToast = false;
            window.history.back();
          }, 5000);
  })
      .catch((error) => {
        this.showfailToast = true;
        this.isAPILoading = false;
        setTimeout(() => {
          this.showfailToast = false;
        }, 10000);
        console.error('Error:', error);
      });
    });

    // Create the event object
      
}


notify() {
  const series = sessionStorage.getItem('sName') ?? 'Unknown';
    this.notificationService.sendSeriesNotification(Number(localStorage.getItem('ID')), Number(this.seriesId), "Series Updated", series).subscribe(response => {
      // console.log(response); // Handle the response as needed
    });
  
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.seriesId = params['id'];
      fetch('https://events-system-back.wn.r.appspot.com/api/eventseries/' + this.seriesId)
        .then(response => response.json())
        .then(data => {
          this.myseries = data;
          console.log(data);
          sessionStorage.setItem('sName', data.name);
          sessionStorage.setItem('sDescription', data.description);
          this.selectedEventIds = data.seriesEventIds;
          this.allEventsSelected = this.selectedEventIds.length === this.events.length;
          sessionStorage.setItem('sselectedEventIds', JSON.stringify(data.seriesEventIds));
  
          // Set the values of snameInput and sdescriptionInput
          if (this.snameInput && this.snameInput.nativeElement) {
            this.snameInput.nativeElement.value = data.name;
          }
          if (this.sdescriptionInput && this.sdescriptionInput.nativeElement) {
            this.sdescriptionInput.nativeElement.value = data.description;
          }
        });
  
      // Fetch social club information for each unique social club
      fetch('https://events-system-back.wn.r.appspot.com/api/events')
        .then(response => response.json())
        .then(async data => { // Mark this function as async
          this.events = Array.isArray(data) ? data : [data];
          this.uniqueSocialClubs = [...new Set(this.events.map(event => event.socialClub))];
          this.otherCheckboxes = new Array(this.uniqueSocialClubs.length).fill(false);
  
          // Prepare fetch requests for each unique social club
          const socialClubFetches = this.uniqueSocialClubs.map(socialClubId =>
            fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + socialClubId)
              .then(response => response.json())
          );
  
          // Wait for all social club fetches to complete
          const socialClubsData: { id: number, name: string }[] = await Promise.all(socialClubFetches);
  
          // Create a dictionary to map social club IDs to names
          const socialClubNames: { [key: number]: string } = {};
          socialClubsData.forEach(data => {
            socialClubNames[data.id] = data.name;
          });
  
          // Map the social club names to the events
          this.events = this.events.map(event => ({
            ...event,
            socialClubName: socialClubNames[event.socialClub]
          }));
  
          // Store the social club data in a property of the component
          this.socialClubs = socialClubsData;
  
          // Update uniqueSocialClubs and otherCheckboxes based on loaded socialClubs
          this.uniqueSocialClubs = [...new Set(this.socialClubs.map(club => club))];
          this.otherCheckboxes = new Array(this.uniqueSocialClubs.length).fill(false);
  
          // Set loading to false once all data is loaded
          this.loading = false;
        });
    });
  }

  onEventSelectionChange(event: Event, eventId: number) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedEventIds.push(eventId);
    } else {
      this.selectedEventIds = this.selectedEventIds.filter(id => id !== eventId);
    }
    sessionStorage.setItem('sselectedEventIds', JSON.stringify(this.selectedEventIds));
    this.allEventsSelected = this.selectedEventIds.length === this.events.length;
  }
  isEventSelected(eventId: number): boolean {
    return this.selectedEventIds.includes(eventId);
  }

  onSelectAllChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.allEventsSelected = target.checked;
    this.selectedEventIds = this.allEventsSelected ? this.events.map(event => event.eventId) : [];
    sessionStorage.setItem('sselectedEventIds', JSON.stringify(this.selectedEventIds));
  }
  onRowClick(eventId: number): void {
    const customEvent = {
      target: {
        checked: !this.isEventSelected(eventId)
      }
    } as unknown as Event; // Cast to unknown first, then to Event
  
    this.onEventSelectionChange(customEvent, eventId);
  }
}
