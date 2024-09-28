import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren, AfterViewChecked, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Location } from '@angular/common';
import validator from 'validator';
import { NotificationService } from 'src/app/notification.service';
import { GoogleMapsLoaderService } from 'src/app/google-maps-loader.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps'
import { DomSanitizer } from '@angular/platform-browser';
import { SanitizePipe } from 'src/app/sanitization.pipe';
@Component({
  selector: 'app-update-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, GoogleMapsModule],
  templateUrl: './UpdateEvent.component.html',
  styleUrl: './UpdateEvent.component.css',
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
export class UpdateEventComponent implements OnInit{
  prepform!: FormGroup;
  agendaform!: FormGroup;
  isAPILoaded = false;
  sanitizePipe: SanitizePipe;
  selectedSocialClubId: number | null = null;
  @ViewChildren('stepInput') stepInputs!: QueryList<ElementRef>;
  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('nameInputs') nameInputs!: ElementRef;
  @ViewChild('descriptionInput') descriptionInput!: ElementRef;
  @ViewChild('StartTimeInput') StartTimeInput!: ElementRef;
  @ViewChild('EndTimeInput') EndTimeInput!: ElementRef;
  @ViewChild('StartDateInput') StartDateInput!: ElementRef;
  @ViewChild('EndDateInput') EndDateInput!: ElementRef;
  @ViewChild('LocationInput') LocationInput!: ElementRef;
  @ViewChild('SocialClubInput') SocialClubInput!: ElementRef;
  
  @ViewChildren('PrepInput') PrepInputs!: QueryList<ElementRef>;
  @ViewChildren('AgendaInput') AgendaInputs!: QueryList<ElementRef>;
  // Define the Prepinputs and Agendainputs as an array of objects
  eventId= '';
  myevent: any = null;
  host: any = null;
  isLoading = true;
  isAPILoading = false;
  showsuccessToast = false;
  eventDietaryAccommodations: string[] = [];
  showfailToast = false;
  isVegetarianSelected = false;
  isVeganSelected = false;
  isHalalSelected = false;
  isGlutenFreeSelected = false;
  tags: string[] = [];
  newTag = '';
  events: any[] = [];
  uniqueSocialClubs: any[] = [];
  checkedSocialClubs: any[] = [];
  allClubsChecked = false;
  socialClubs: any[] = [];
  otherCheckboxes: boolean[] = [];
  latitude: number | undefined;
  longitude: number | undefined;
  location = '';
  mapOptions: google.maps.MapOptions = {
    center: { lat: -25.7552742, lng: 28.2337029 },
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  markerPosition = { lat: 48.8634286, lng: 2.3114617 };

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private notificationService: NotificationService, private sanitizer: DomSanitizer, private ngZone: NgZone, private googleMapsLoader: GoogleMapsLoaderService) {
    this.sanitizePipe = new SanitizePipe(this.sanitizer);

    this.prepform = this.fb.group({
      prepinputs: this.fb.array([])
    });
  
    this.agendaform = this.fb.group({
      agendainputs: this.fb.array([])
    });
   }  goBack(): void {
    window.history.back();
  }
presubmit(){
  if (this.nameInput.nativeElement.value === '' || 
    this.descriptionInput.nativeElement.value  === '' || 
    this.StartTimeInput.nativeElement.value === '' || 
    this.EndTimeInput.nativeElement.value === '' || 
    this.StartDateInput.nativeElement.value === '' || 
    this.EndDateInput.nativeElement.value === '' || 
    this.LocationInput.nativeElement.value === '' || 
    this.SocialClubInput.nativeElement.value === '') {
    alert('Please fill in all the details');
    return;
}else{
  this.submit();
}
}
  submit(){
    this.isAPILoading = true; // Set isLoading to true at the start of the method

    this.route.params.subscribe(params => {
      this.eventId = params['id'];
  // Retrieve tags from session storage
  const savedTags = sessionStorage.getItem('utags');
  const tags = savedTags ? JSON.parse(savedTags) : [];

      const event = {
        title: this.sanitizePipe.transform(this.nameInput.nativeElement.value),
        description: this.sanitizePipe.transform(this.descriptionInput.nativeElement.value),
        startTime: this.sanitizePipe.transform(this.StartTimeInput.nativeElement.value),
        endTime: this.sanitizePipe.transform(this.EndTimeInput.nativeElement.value),
        startDate: this.sanitizePipe.transform(this.StartDateInput.nativeElement.value),
        endDate: this.sanitizePipe.transform(this.EndDateInput.nativeElement.value),
        location: this.sanitizePipe.transform(this.LocationInput.nativeElement.value),

        hostId: localStorage.getItem('ID'),
        geolocation: this.latitude + ', ' + this.longitude,
        socialClub: this.sanitizePipe.transform(this.SocialClubInput.nativeElement.value),
        eventPictureLink: "https://example.com/soccer-tournament.jpg", // Replace with actual picture link
        eventAgendas: this.agendainputs?.value.map((input: any) => this.sanitizePipe.transform(input)),
        eventPreparation: this.prepinputs?.value.map((input: any) => this.sanitizePipe.transform(input)),
        
        eventDietaryAccommodations: [
          sessionStorage.getItem('uuupdateisVegetarianSelected') === 'true' ? "Vegetarian" : null,
          sessionStorage.getItem('uuupdateisVeganSelected') === 'true' ? "Vegan" : null,
          sessionStorage.getItem('uuuupdateisHalalSelected') === 'true' ? "Halal" : null,
          sessionStorage.getItem('uuupdateisGlutenFreeSelected') === 'true' ? "Gluten-free" : null
        ].filter(Boolean), // Remove null values
        tags: tags // Add tags to the event object

      };
      // Send the POST request
      fetch('https://events-system-back.wn.r.appspot.com/api/events/' + this.eventId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      })
      .then(response => response.json())
      .then(data => {
          // Show the success toast
        console.log(data);

          this.showsuccessToast = true;
          this.notify();
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

addTag(): void {
  if (this.newTag.trim() && this.tags.length < 5) {
    this.tags.push(this.newTag.trim());
    this.newTag = ''; // Clear the input
    this.saveTagsToSessionStorage();

  }
}



removeTag(index: number) {
  if (index >= 0 && index < this.tags.length) {
    this.tags.splice(index, 1);
    this.saveTagsToSessionStorage();
  }
}

saveTagsToSessionStorage() {
  sessionStorage.setItem('utags', JSON.stringify(this.tags));
}

notify() {
const eventName = sessionStorage.getItem('uName') ?? 'Unknown';
  this.notificationService.sendNotification(Number(localStorage.getItem('ID')), Number(this.eventId), "Event Updated", eventName).subscribe(response => {
    // console.log(response); // Handle the response as needed
  });

}
get prepinputs() {
  return this.prepform.get('prepinputs') as FormArray;
}
get agendainputs() {
  return this.agendaform.get('agendainputs') as FormArray;
}

addprepInput(value = '') {
  if (this.prepinputs.length < 5) {
    this.prepinputs.push(this.fb.control(value));
  }
  this.nameInput.nativeElement.value = sessionStorage.getItem('uName');
  this.descriptionInput.nativeElement.value = sessionStorage.getItem('uDescription');
  this.StartTimeInput.nativeElement.value = sessionStorage.getItem('uStartTime');
  this.EndTimeInput.nativeElement.value = sessionStorage.getItem('uEndTime');
  this.StartDateInput.nativeElement.value = sessionStorage.getItem('uStartDate');
  this.EndDateInput.nativeElement.value = sessionStorage.getItem('uEndDate');
  this.LocationInput.nativeElement.value = sessionStorage.getItem('uLocation');
  this.SocialClubInput.nativeElement.value = sessionStorage.getItem('uSocialClub');
}

addagendaInput(value = '') {
  if (this.agendainputs.length < 5) {
    this.agendainputs.push(this.fb.control(value));
  }
  this.nameInput.nativeElement.value = sessionStorage.getItem('uName');
  this.descriptionInput.nativeElement.value = sessionStorage.getItem('uDescription');
  this.StartTimeInput.nativeElement.value = sessionStorage.getItem('uStartTime');
  this.EndTimeInput.nativeElement.value = sessionStorage.getItem('uEndTime');
  this.StartDateInput.nativeElement.value = sessionStorage.getItem('uStartDate');
  this.EndDateInput.nativeElement.value = sessionStorage.getItem('uEndDate');
  this.LocationInput.nativeElement.value = sessionStorage.getItem('uLocation');
  this.SocialClubInput.nativeElement.value = sessionStorage.getItem('uSocialClub');
}

initializeGooglePlaces() {
  const input = this.LocationInput.nativeElement as HTMLInputElement;
  const autocomplete = new google.maps.places.Autocomplete(input, {
    // types: ['geocode']
  });

  autocomplete.addListener('place_changed', () => {
    this.ngZone.run(() => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.location = place.formatted_address || '';
        sessionStorage.setItem('Location', this.location); // Store the selected location in sessionStorage
        this.updateMapCenter(); // Update the map center
      }
    });
  });
}

updateMapCenter() {
  if (this.latitude !== undefined && this.longitude !== undefined) {
    this.mapOptions = {
      ...this.mapOptions,
      center: { lat: this.latitude, lng: this.longitude }
    };
    this.markerPosition = { lat: this.latitude, lng: this.longitude };
  }
}

removeprepInput(index: number) {
  this.prepinputs.removeAt(index);
}
removeagendaInput(index: number) {
  this.agendainputs.removeAt(index);
}
saveInputs() {
  sessionStorage.setItem('uprepinputs', JSON.stringify(this.prepinputs.value));
  sessionStorage.setItem('uagendainputs', JSON.stringify(this.agendainputs.value));
}
  ngOnInit(): void {
    this.route.params.subscribe(params => {   
      this.prepform = this.fb.group({
        prepinputs: this.fb.array([])
      });
      this.agendaform = this.fb.group({
        agendainputs: this.fb.array([])
      });

      this.eventId = params['id'];
    // Fetch all social clubs
    fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs')
      .then(response => response.json())
      .then(data => {
        this.socialClubs = data;
        this.uniqueSocialClubs = [...new Set(this.socialClubs.map(club => club.name))];
        this.otherCheckboxes = new Array(this.uniqueSocialClubs.length).fill(false);
      });

      fetch('https://events-system-back.wn.r.appspot.com/api/events/' + this.eventId)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.myevent = data;
        // console.log(this.myevent);
        this.nameInput.nativeElement.value = sessionStorage.setItem('uName', data.title);
        this.descriptionInput.nativeElement.value = sessionStorage.setItem('uDescription', data.description);
        this.StartTimeInput.nativeElement.value = sessionStorage.setItem('uStartTime', data.startTime);
        this.EndTimeInput.nativeElement.value = sessionStorage.setItem('uEndTime', data.endTime);
        this.StartDateInput.nativeElement.value = sessionStorage.setItem('uStartDate', data.startDate);
        this.EndDateInput.nativeElement.value = sessionStorage.setItem('uEndDate', data.endDate);
        this.LocationInput.nativeElement.value = sessionStorage.setItem('uLocation', data.location);
        this.SocialClubInput.nativeElement.value = sessionStorage.setItem('uSocialClub', this.getSocialClubNameById(this.myevent.socialClub));
        if(data.eventDietaryAccommodations.includes('Vegetarian')){
          sessionStorage.setItem('uisVegetarianSelected', 'true');
          sessionStorage.setItem('uupdateisVegetarianSelected', 'true');
        }else{
          sessionStorage.setItem('uisVegetarianSelected', 'false');
          sessionStorage.setItem('uupdateisVegetarianSelected', 'false');
        }
        if(data.eventDietaryAccommodations.includes('Vegan')){
          sessionStorage.setItem('uisVeganSelected', 'true');
          sessionStorage.setItem('uupdateisVeganSelected', 'true');
        }else{
          sessionStorage.setItem('uisVeganSelected', 'false');
          sessionStorage.setItem('uupdateisVeganSelected', 'false');
        }
        if(data.eventDietaryAccommodations.includes('Halal')){
          sessionStorage.setItem('uisHalalSelected', 'true');
          sessionStorage.setItem('uupdateisHalalSelected', 'true');
        }else{
          sessionStorage.setItem('uisHalalSelected', 'false');
          sessionStorage.setItem('uupdateisHalalSelected', 'false');
        }
        if(data.eventDietaryAccommodations.includes('Gluten-free')){
          sessionStorage.setItem('uisGlutenFreeSelected', 'true');
          sessionStorage.setItem('uupdateisGlutenFreeSelected', 'true');
        }else{
          sessionStorage.setItem('uisGlutenFreeSelected', 'false');
          sessionStorage.setItem('uupdateisGlutenFreeSelected', 'false');
        }
        const prepsavedInputs = this.myevent.eventPreparation;
        if (prepsavedInputs) {
          const prepinputs = prepsavedInputs;
          prepinputs.forEach((input: any) => this.addprepInput(input));
        }
        const agendasavedInputs = this.myevent.eventAgendas;
        if (agendasavedInputs) {
          const agendainputs = agendasavedInputs;
          agendainputs.forEach((input: any) => this.addagendaInput(input));
        }
        if (this.myevent && this.myevent.dietaryAccommodations) {       // Check if the event has dietary accommodations
          this.isVegetarianSelected = data.dietaryAccommodations.includes("Vegetarian"); 
          sessionStorage.setItem('uupdateisVegetarianSelected', String(this.isVegetarianSelected));
          this.isVeganSelected = data.dietaryAccommodations.includes('Vegan');
          sessionStorage.setItem('uupdateisVeganSelected', String(this.isVeganSelected));
          this.isHalalSelected = data.dietaryAccommodations.includes('Halal');
          sessionStorage.setItem('uupdateisHalalSelected', String(this.isHalalSelected));
          this.isGlutenFreeSelected = data.dietaryAccommodations.includes('Gluten-Free');
          sessionStorage.setItem('uupdateisGlutenFreeSelected', String(this.isGlutenFreeSelected));
        }

        this.isVegetarianSelected = sessionStorage.getItem('uisVegetarianSelected') === 'true';    
        this.isVeganSelected = sessionStorage.getItem('uisVeganSelected') === 'true';
        this.isHalalSelected = sessionStorage.getItem('uisHalalSelected') === 'true';
        this.isGlutenFreeSelected = sessionStorage.getItem('uisGlutenFreeSelected') === 'true';

        sessionStorage.setItem('utags', JSON.stringify(data.tags));

                // Load tags from session storage
        const savedTags = sessionStorage.getItem('utags');
        if (savedTags) {
          this.tags = JSON.parse(savedTags);
        }
        
              });
    });
    setTimeout(() => {
          this.googleMapsLoader.load().then(() => {
            this.isAPILoaded = true;
            this.initializeGooglePlaces();
          }).catch(error => {
            console.error('Error loading Google Maps API:', error);
          });      }, 100);

  }

  getSocialClubNameById(id: number): string {
    const club = this.socialClubs.find(club => club.id === id);
    return club ? club.name : '';
  }
  
  onSocialClubChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = selectElement.value;
    sessionStorage.setItem('uSocialClub', selectedId);
  }


  toggleDietaryAccommodation(accommodation: string) {
    const index = this.eventDietaryAccommodations.indexOf(accommodation);
    if (index > -1) {
      // If the accommodation is already selected, remove it
      this.eventDietaryAccommodations.splice(index, 1);
    } else {
      // If the accommodation is not selected, add it
      this.eventDietaryAccommodations.push(accommodation);
    }
  }
  // ngAfterViewChecked(): void {
  //   setTimeout(() => {
  //     this.googleMapsLoader.load().then(() => {
  //       this.initializeGooglePlaces();
  //     }).catch(error => {
  //       console.error('Error loading Google Maps API:', error);
  //     });      }, 100);
  //   if (this.myevent) {
  //     this.nameInput.nativeElement.value = this.myevent.title;
  //     this.descriptionInput.nativeElement.value = this.myevent.description;
  //     this.StartTimeInput.nativeElement.value = this.formatTime(this.myevent.startTime);
  //     this.EndTimeInput.nativeElement.value = this.formatTime(this.myevent.endTime);
  //     this.StartDateInput.nativeElement.value = this.myevent.startDate;
  //     this.EndDateInput.nativeElement.value = this.myevent.endDate;
  //     this.LocationInput.nativeElement.value = this.myevent.location;
  //     this.SocialClubInput.nativeElement.value = this.myevent.socialClub;
  //   }
  // }
  formatTime(time: string | undefined): string | undefined {
    if (time) {
      const parts = time.split(':');
      return parts[0] + ':' + parts[1];
    }
    return undefined;
  }

  isAccommodationAvailable(accommodation: string): boolean {
    return this.myevent.dietaryAccommodations.includes(accommodation);
  }

  // Add these methods
  toggleVegetarian() {
    this.isVegetarianSelected = !this.isVegetarianSelected;
    sessionStorage.setItem('uupdateisVegetarianSelected', String(this.isVegetarianSelected));

  }

  toggleVegan() {
    this.isVeganSelected = !this.isVeganSelected;
    sessionStorage.setItem('uupdateisVeganSelected', String(this.isVeganSelected));

  }

  toggleHalal() {
    this.isHalalSelected = !this.isHalalSelected;
    sessionStorage.setItem('uupdateisHalalSelected', String(this.isHalalSelected));

  }

  toggleGlutenFree() {
    this.isGlutenFreeSelected = !this.isGlutenFreeSelected;  sessionStorage.setItem('uisGlutenFreeSelected', String(this.isGlutenFreeSelected));
    sessionStorage.setItem('uupdateisGlutenFreeSelected', String(this.isGlutenFreeSelected));

  }

  openInMaps() {
    const location = sessionStorage.getItem('Location');
    if (location) {
      const encodedLocation = encodeURIComponent(location);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
      window.open(mapsUrl, '_blank');
    } else {
      alert('Please enter a location first.');
    }
  }

  updateMarkerPosition(location: string) {
    if (location) {
      sessionStorage.setItem('Location', location);
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: location }, (results:any, status:any) => {
        if (status === 'OK' && results[0].geometry.location) {
          this.latitude = results[0].geometry.location.lat();
          this.longitude = results[0].geometry.location.lng();
          this.updateMapCenter(); // Update the map center
        }
      });
    }
  }
  
}
