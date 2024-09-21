
import { AfterViewInit, Component, ViewChild, ElementRef, QueryList, ViewChildren, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Location } from '@angular/common';
import validator from 'validator';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GoogleMapsLoaderService } from 'src/app/google-maps-loader.service';
import { GoogleMapsModule } from '@angular/google-maps'
import { DomSanitizer } from '@angular/platform-browser';
import { SanitizePipe } from 'src/app/sanitization.pipe';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, GoogleMapsModule],
  templateUrl: './CreateEvent.component.html',
  styleUrl: './CreateEvent.component.css',
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
    trigger('smoothChange', [
      transition(':increment', [
        style({ opacity: 0.5 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ opacity: 0.5 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CreateEventComponent implements AfterViewInit, OnInit{
  prepform!: FormGroup;
  agendaform!: FormGroup;
  sanitizePipe: SanitizePipe;
  constructor(private location: Location, private fb: FormBuilder, private ngZone: NgZone, private sanitizer: DomSanitizer, private googleMapsLoader: GoogleMapsLoaderService) { 
    this.sanitizePipe = new SanitizePipe(this.sanitizer);

  }

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
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChildren('PrepInput') PrepInputs!: QueryList<ElementRef>;
  @ViewChildren('AgendaInput') AgendaInputs!: QueryList<ElementRef>;
  eventName= '';
  currentStep = 0;
  isAPILoading = false;
  isNameEmpty = false;
  isDescriptionEmpty = false;
  generatedDescriptions: string[] = [];
  isstep2Empty = false;
  showsuccessToast = false;
  suggestedStart: any;
  suggestedEnd: any;
  showfailToast = false;
  uniqueSocialClubs: any[] = [];
  checkedSocialClubs: any[] = [];
  allClubsChecked = false;
  socialClubs: any[] = [];
  otherCheckboxes: boolean[] = [];
  events: any[] = [];
  filteredEvents: any[] = [];
  selectedDietaryAccommodation = '';
  locationValue = '';
  tags: string[] = [];
  newTag = '';
  isLoading = false;
  latitude: number | undefined;
  longitude: number | undefined;
  mapOptions: google.maps.MapOptions = {
    center: { lat: -25.7552742, lng: 28.2337029 },
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  markerPosition = { lat: 48.8634286, lng: 2.3114617 };
  submit(){
    // Create the event object
    this.isAPILoading = true;
    const getSocialClubIdByName = (name: string): string | null => {
      const club = this.uniqueSocialClubs.find(club => club.name === name);
      return club ? club.id : null;
    };

  // Retrieve tags from session storage
  const savedTags = sessionStorage.getItem('tags');
  const tags = savedTags ? JSON.parse(savedTags) : [];
    const event = {
      title: this.sanitizePipe.transform(this.nameInput.nativeElement.value),
      description: this.sanitizePipe.transform(this.descriptionInput.nativeElement.value),
      startTime: this.sanitizePipe.transform(this.StartTimeInput.nativeElement.value+':00'),
      endTime: this.sanitizePipe.transform(this.EndTimeInput.nativeElement.value+':00'),
      startDate: this.sanitizePipe.transform(this.StartDateInput.nativeElement.value),
      endDate: this.sanitizePipe.transform(this.EndDateInput.nativeElement.value),
      location: this.sanitizePipe.transform(this.LocationInput.nativeElement.value),
      hostId: localStorage.getItem('ID'),
      geolocation: this.latitude + ', ' + this.longitude,
      socialClub: getSocialClubIdByName(validator.escape(this.SocialClubInput.nativeElement.value)),
      eventPictureLink: "https://example.com/soccer-tournament.jpg", // Replace with actual picture link
      eventAgendas: this.agendaform.get('agendainputs')?.value.map((input: any) => this.sanitizePipe.transform(input)),
      eventPreparation: this.prepform.get('prepinputs')?.value.map((input: any) => this.sanitizePipe.transform(input)),
      eventDietaryAccommodations: [
        this.isVegetarianSelected ? "Vegetarian" : null,
        this.isVeganSelected ? "Vegan" : null,
        this.isHalalSelected ? "Halal" : null,
        this.isGlutenFreeSelected ? "Gluten-free" : null
      ].filter(Boolean), // Remove null values
      tags: tags // Add tags to the event object

    };

    console.log(event);
    // Send the POST request
    fetch('https://events-system-back.wn.r.appspot.com/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    })
    .then(response => response.json())
    .then(data => {
        // Show the success toast
        this.showsuccessToast = true;
        this.isAPILoading = false;
        sessionStorage.clear();
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
}
updateMapCenter() {
  if (this.latitude !== undefined && this.longitude !== undefined) {
    this.mapOptions.center = { lat: this.latitude, lng: this.longitude };
    this.markerPosition = { lat: this.latitude, lng: this.longitude };
  }
}
ngOnInit() {
  // this.initializeGooglePlaces();

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
          const socialClubsData = await Promise.all(socialClubFetches);
          socialClubsData.forEach(data => {
            console.log(data);
            // Store the social club data in a property of the component
            this.socialClubs.push(data);
          });
          // Update uniqueSocialClubs and otherCheckboxes based on loaded socialClubs
          this.uniqueSocialClubs = [...new Set(this.socialClubs.map(club => club))];
          this.otherCheckboxes = new Array(this.uniqueSocialClubs.length).fill(false);
        });
  // const prepInputsData = sessionStorage.getItem('PrepInputs');
  // const agendaInputsData = sessionStorage.getItem('AgendaInputs');
  this.prepform = this.fb.group({
    prepinputs: this.fb.array([])
  });
  this.agendaform = this.fb.group({
    agendainputs: this.fb.array([])
  });
// Subscribe to changes in the form array if 'prepinputs' exists
this.prepform.get('prepinputs')?.valueChanges.subscribe(values => {
  // console.log('Form values changed:', values);
  // Store the values as needed, e.g., in sessionStorage
  sessionStorage.setItem('prepinputs', JSON.stringify(values));
});

// Subscribe to changes in the form array if 'agendainputs' exists
this.prepform.get('agendainputs')?.valueChanges.subscribe(values => {
  // console.log('Form values changed:', values);
  // Store the values as needed, e.g., in sessionStorage
  sessionStorage.setItem('agendainputs', JSON.stringify(values));
});

  const prepsavedInputs = sessionStorage.getItem('prepinputs');
  if (prepsavedInputs) {
    const prepinputs = JSON.parse(prepsavedInputs);
    prepinputs.forEach((input: any) => this.addprepInput(input));
  }
  const agendasavedInputs = sessionStorage.getItem('agendainputs');
  if (agendasavedInputs) {
    const agendainputs = JSON.parse(agendasavedInputs);
    agendainputs.forEach((input: any) => this.addagendaInput(input));
  }
  // Load tags from session storage
  const savedTags = sessionStorage.getItem('tags');
  if (savedTags) {
    this.tags = JSON.parse(savedTags);
  }
  // this.Prepinputs = prepInputsData ? JSON.parse(prepInputsData) : [];
  // this.Agendainputs = agendaInputsData ? JSON.parse(agendaInputsData) : [];
  this.isVegetarianSelected = sessionStorage.getItem('isVegetarianSelected') === 'false';   // Set the default value to false
  this.isVeganSelected = sessionStorage.getItem('isVeganSelected') === 'false';
  this.isHalalSelected = sessionStorage.getItem('isHalalSelected') === 'false';
  this.isGlutenFreeSelected = sessionStorage.getItem('isGlutenFreeSelected') === 'false';


}

initializeGooglePlaces() {
  const input = this.LocationInput.nativeElement as HTMLInputElement;

  const autocomplete = new google.maps.places.Autocomplete(input, {
    // types: ['geocode']
  });

  autocomplete.addListener('place_changed', () => {
    this.ngZone.run(() => {

      const place = autocomplete.getPlace();
      if (place.geometry) {
        this.latitude = place.geometry.location?.lat();
        this.longitude = place.geometry.location?.lng();
        console.log('Latitude:', this.latitude);
        console.log('Longitude:', this.longitude);
        this.updateMapCenter();
      }
    });
  });
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

presubmit(){
  const missingDetails = [];

  if (!sessionStorage.getItem('Name') || sessionStorage.getItem('Name') === '') {
    missingDetails.push('title');
  }
  if (!sessionStorage.getItem('Description') || sessionStorage.getItem('Description') === '') {
    missingDetails.push('Description');
  }
  if (!sessionStorage.getItem('StartTime') || sessionStorage.getItem('StartTime') === '') {
    missingDetails.push('Start time');
  }
  if (!sessionStorage.getItem('EndTime') || sessionStorage.getItem('EndTime') === '') {
    missingDetails.push('End time');
  }
  if (!sessionStorage.getItem('StartDate') || sessionStorage.getItem('StartDate') === '') {
    missingDetails.push('Start date');
  }
  if (!sessionStorage.getItem('EndDate') || sessionStorage.getItem('EndDate') === '') {
    missingDetails.push('End date');
  }
  if (!sessionStorage.getItem('Location') || sessionStorage.getItem('Location') === '') {
    missingDetails.push('Location');
  }
  
  if (missingDetails.length > 0) {
    alert('Please fill in the following details: ' + missingDetails.join(', '));
    return;
  }else{
    this.submit();
  }
}


addTag(): void {
  if (this.newTag.trim() && this.tags.length < 5) {
    this.tags.push(this.newTag.trim());
    this.newTag = ''; // Clear the input
    this.saveTagsToSessionStorage();

  }
}

addTag1(tag: string): void {
  if (tag.trim() && this.tags.length < 5) {
    this.tags.push(tag.trim());
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
  sessionStorage.setItem('tags', JSON.stringify(this.tags));
}

  // Add a variable to save the input values
  inputValues: string[] = [];
  isTransitioningToPreviousStep = false;
  loadDataFromSessionStorage1() {
    const namedata = sessionStorage.getItem('Name');
    if (namedata) {
      this.nameInput.nativeElement.value = namedata;
    }
  }
  loadDataFromSessionStorage2() {
    const descriptiondata = sessionStorage.getItem('Description');
    if (descriptiondata) {
      this.descriptionInput.nativeElement.value = descriptiondata;
    }
  }
  loadDataFromSessionStorage3() {
    const startTimedata = sessionStorage.getItem('StartTime');
    const endTimedata = sessionStorage.getItem('EndTime');
    const StartDatedata = sessionStorage.getItem('StartDate');
    const EndDatedata = sessionStorage.getItem('EndDate');
    const Locationdata = sessionStorage.getItem('Location');
    const SocialClubdata = sessionStorage.getItem('SocialClub');
    if (startTimedata) {
      this.StartTimeInput.nativeElement.value = startTimedata;
    }
    if (endTimedata) {
      this.EndTimeInput.nativeElement.value = endTimedata;
    }
    if (StartDatedata) {
      this.StartDateInput.nativeElement.value = StartDatedata;
    }
    if (EndDatedata) {
      this.EndDateInput.nativeElement.value = EndDatedata;
    }
    // if (Locationdata) {
    //   this.LocationInput.nativeElement.value = Locationdata;
    // }
    if (SocialClubdata) {
      this.SocialClubInput.nativeElement.value = SocialClubdata;
    }
  }
  loadDataFromSessionStorage4() {
    this.isVegetarianSelected = sessionStorage.getItem('isVegetarianSelected') === 'true';    
    this.isVeganSelected = sessionStorage.getItem('isVeganSelected') === 'true';
    this.isHalalSelected = sessionStorage.getItem('isHalalSelected') === 'true';
    this.isGlutenFreeSelected = sessionStorage.getItem('isGlutenFreeSelected') === 'true';
  }

  loadDataFromSessionStorage5() {
    // Retrieve the PrepInputs and AgendaInputs
    // const namedata = sessionStorage.getItem('Name');
    // console.log('storage 5' + namedata);
    // if (namedata) {
    //   this.nameInput.nativeElement.value = namedata;
    // }
    this.loadDataFromSessionStorage1();
    this.loadDataFromSessionStorage2();
    this.loadDataFromSessionStorage3();
    this.loadDataFromSessionStorage4();
  }
  ngAfterViewChecked() {
    if (this.currentStep === 0 && this.nameInput && this.nameInput.nativeElement && this.nameInput.nativeElement.offsetParent !== null) {
      this.loadDataFromSessionStorage1();
    } else if (this.currentStep === 1 && this.descriptionInput && this.descriptionInput.nativeElement && this.descriptionInput.nativeElement.offsetParent !== null) {
      this.loadDataFromSessionStorage2();
    } else if (this.currentStep === 2 && this.StartTimeInput && this.StartTimeInput.nativeElement && this.StartTimeInput.nativeElement.offsetParent !== null) {
      this.loadDataFromSessionStorage3();
    } else if (this.currentStep === 3 && this.PrepInputs && this.PrepInputs.first && this.PrepInputs.first.nativeElement && this.PrepInputs.first.nativeElement.offsetParent !== null) {
      this.loadDataFromSessionStorage4();
    } else if (this.currentStep === 4 && this.nameInput && this.StartTimeInput && this.nameInput.nativeElement && this.nameInput.nativeElement.offsetParent !== null) {
      this.loadDataFromSessionStorage5();
    }
    // Add other conditions for other steps
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
  }
  
  addagendaInput(value = '') {
    if (this.agendainputs.length < 5) {
      this.agendainputs.push(this.fb.control(value));
    }
  }
  removeprepInput(index: number) {
    this.prepinputs.removeAt(index);
  }
  removeagendaInput(index: number) {
    this.agendainputs.removeAt(index);
  }
  saveInputs() {
    sessionStorage.setItem('prepinputs', JSON.stringify(this.prepinputs.value));
    sessionStorage.setItem('agendainputs', JSON.stringify(this.agendainputs.value));
  }
  ngAfterViewInit() {


    const namedata = sessionStorage.getItem('Name');
    if (namedata) {
      this.nameInput.nativeElement.value = namedata;
    }
    const locationData = sessionStorage.getItem('Location');
    if (locationData) {
      this.locationValue = locationData;
    }
  }

  nextStep() {
    if ( this.nameInput.nativeElement.value === '') {
      this.isNameEmpty = true;
      return;
    }
    if (this.currentStep < 4) {
      const nameinput = this.nameInput.nativeElement.value;
      sessionStorage.setItem(`Name`, nameinput);
      this.isNameEmpty = false;
      this.currentStep++;
    }
  }
  nextStep1(){
    if ( this.descriptionInput.nativeElement.value === '') {
      this.isDescriptionEmpty = true;
      return;
    }
    if (this.currentStep < 4) {
      const descriptioninput = this.descriptionInput.nativeElement.value;
      sessionStorage.setItem(`Description`, descriptioninput);
      this.isDescriptionEmpty = false;
      this.currentStep++;
      if (this.currentStep === 2) {
        setTimeout(() => {
          this.googleMapsLoader.load().then(() => {
            this.initializeGooglePlaces();
          }).catch(error => {
            console.error('Error loading Google Maps API:', error);
          });      }, 1);
      }
    }
  }
  nextStep2(){
    console.log(this.StartTimeInput.nativeElement.value);
    console.log(this.EndTimeInput.nativeElement.value);
    console.log(this.StartDateInput.nativeElement.value);
    console.log(this.EndDateInput.nativeElement.value);
    console.log("location: " + this.LocationInput.nativeElement.value);
    console.log(this.SocialClubInput.nativeElement.value);
    if ( this.StartTimeInput.nativeElement.value === '' || this.EndTimeInput.nativeElement.value === '' || this.StartDateInput.nativeElement.value === '' || this.EndDateInput.nativeElement.value === '' || this.LocationInput.nativeElement.value === '' || this.SocialClubInput.nativeElement.value === '') {
      this.isstep2Empty = true;
      return;
    }
    if (this.currentStep < 4) {
      const starttimeinput = this.StartTimeInput.nativeElement.value;
      const endtimeinput = this.EndTimeInput.nativeElement.value;
      const startDateTime = new Date(this.StartDateInput.nativeElement.value + 'T' + this.StartTimeInput.nativeElement.value);
      const endDateTime = new Date(this.EndDateInput.nativeElement.value + 'T' + this.EndTimeInput.nativeElement.value);
      if (startDateTime >= endDateTime) {
        alert('End time & Date must be later than Start time & Date');
        return;
      }
      const startdateinput = this.StartDateInput.nativeElement.value;
      const enddateinput = this.EndDateInput.nativeElement.value;
      const locationinput = this.LocationInput.nativeElement.value;
      const socialclubinput = this.SocialClubInput.nativeElement.value;
      sessionStorage.setItem(`StartTime`, starttimeinput);
      sessionStorage.setItem(`EndTime`, endtimeinput);
      sessionStorage.setItem(`StartDate`, startdateinput);
      sessionStorage.setItem(`EndDate`, enddateinput);
      sessionStorage.setItem(`Location`, locationinput);
      sessionStorage.setItem(`SocialClub`, socialclubinput);
      this.isstep2Empty = false;

      this.currentStep++;
    }
  }
  nextStep3() {
    if (this.currentStep < 4) {
      this.saveInputs();
      this.currentStep++;
    }
  }
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  navigateToStep(step: number) {
    this.currentStep = step;
    if(this.currentStep === 2){
      setTimeout(() => {
        this.googleMapsLoader.load().then(() => {
          this.initializeGooglePlaces();
        }).catch(error => {
          console.error('Error loading Google Maps API:', error);
        });      }, 1);
    }

  }
  goBack(): void {
    window.history.back();
  }
  isVegetarianSelected = false;
  isVeganSelected = false;
  isHalalSelected = false;
  isGlutenFreeSelected = false;

  toggleVegetarian() {
    this.isVegetarianSelected = !this.isVegetarianSelected;
    sessionStorage.setItem('isVegetarianSelected', String(this.isVegetarianSelected));

  }

  toggleVegan() {
    this.isVeganSelected = !this.isVeganSelected;
    sessionStorage.setItem('isVeganSelected', String(this.isVeganSelected));

  }

  toggleHalal() {
    this.isHalalSelected = !this.isHalalSelected;
    sessionStorage.setItem('isHalalSelected', String(this.isHalalSelected));

  }

  toggleGlutenFree() {
    this.isGlutenFreeSelected = !this.isGlutenFreeSelected;  sessionStorage.setItem('isGlutenFreeSelected', String(this.isGlutenFreeSelected));
    sessionStorage.setItem('isGlutenFreeSelected', String(this.isGlutenFreeSelected));

  }
  suggestTime() {
    this.isLoading = true; // Set loading state to true

    // Retrieve the recommended start and end times
    fetch('https://safe-dawn-94912-2365567c9819.herokuapp.com/suggest-times', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      console.log("recommended", data);

      this.StartTimeInput.nativeElement.value = data.peak_start_time.split(':').slice(0, 2).join(':');
      this.EndTimeInput.nativeElement.value = data.peak_end_time.split(':').slice(0, 2).join(':');

      this.isLoading = false; // Set loading state to false
    })
    .catch(error => {
      console.error('Error fetching suggested times:', error);
      this.isLoading = false; // Set loading state to false in case of error
    });
  }

  suggestDescriptions() {
    console.log(sessionStorage.getItem('Name'));
    const name = sessionStorage.getItem('Name');
    if (!name) {
      window.alert("event title is required to generate description suggestions");
      return;
    }
    this.isLoading = true; // Set loading state to true
    fetch(`https://safe-dawn-94912-2365567c9819.herokuapp.com/generate-descriptions?event_title="${name}"`, {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      console.log("descriptions", data);
      this.isLoading = false; // Set loading state to false
  
      if (Array.isArray(data.descriptions) && data.descriptions.length > 0) {
        const concatenatedDescriptions = data.descriptions[0];
        // Split the concatenated descriptions into an array
        const descriptions = concatenatedDescriptions.split(/\d\.\s/).filter(Boolean);
        this.generatedDescriptions = [];
        
        // Add each description sequentially with a delay
        descriptions.forEach((description:any, index:any) => {
          setTimeout(() => {
            this.generatedDescriptions.push(description);
            // Trigger change detection if necessary
          }, index * 500); // Adjust the delay (1000ms = 1s) as needed
        });
      } else {
        console.error('Error: descriptions is not in the expected format');
      }
    })
    .catch(error => {
      console.error('Error fetching suggested descriptions:', error);
      this.isLoading = false;
    });
  }
  isDescriptionSelected = false;
  selectedDescription = '';
  selectDescription(description: string) {
    this.descriptionInput.nativeElement.value = description;
    this.selectedDescription = description;
    this.isDescriptionSelected = true;
  }

  
  clearDescription() {
    this.selectedDescription = '';
    this.isDescriptionSelected = false;
    this.descriptionInput.nativeElement.value = '';
  }

  suggestTags() {
    console.log(sessionStorage.getItem('Name'));
    const name = sessionStorage.getItem('Name');
    if (!name) {
      window.alert("Event title is required to generate tag suggestions");
      return;
    }
    this.isLoading = true; // Set loading state to true
    fetch(`https://safe-dawn-94912-2365567c9819.herokuapp.com/generate-tags?event_title="${name}"`, {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      console.log("tags", data);
      this.isLoading = false; // Set loading state to false
  
      // Split the single string into individual tags
      if (data.tags && data.tags.length > 0) {
        const tagsArray = data.tags[0].split('\n').map((tag: any) => tag.trim().replace(/^\d+\.\s*#?/, ''));

        // Add each tag sequentially with a delay
        tagsArray.forEach(( tag: any, index:any) => {
          setTimeout(() => {
            this.addTag1(tag);
          }, index * 500); // Adjust the delay (1000ms = 1s) as needed
        });
      } else {
        this.tags = [];
      }
    })
    .catch(error => {
      console.error('Error fetching suggested descriptions:', error);
      this.isLoading = false;
    });
  }
  generatedPrepDetails: string[] = [];
  generatedAgendaDetails: string[] = [];

  suggestPrep() {
    const eventTitle = sessionStorage.getItem('Name');
    if (!eventTitle) {
      alert('Event title is required');
      return;
    }
  
    this.isLoading = true;
    fetch(`https://safe-dawn-94912-2365567c9819.herokuapp.com/generate-prep?event_title="${eventTitle}"`, {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      this.isLoading = false;
  
      // Split the single string into individual preparation details
      if (data.prep && data.prep.length > 0) {
        this.generatedPrepDetails = data.prep[0].split('\n').map((detail: any) => detail.trim().replace(/^\d+\.\s*/, ''));
        // Add each detail sequentially with a delay
        this.generatedPrepDetails.forEach((detail, index) => {
          setTimeout(() => {
            this.addprepInput(detail);
          }, index * 500); // Adjust the delay (1000ms = 1s) as needed
        });
      } else {
        this.generatedPrepDetails = [];
      }
    })
    .catch(error => {
      console.error('Error generating preparation details:', error);
      this.isLoading = false;
    });
  }

  suggestAgenda() {
    const eventTitle = sessionStorage.getItem('Name');
    if (!eventTitle) {
      alert('Event title is required');
      return;
    }

    this.isLoading = true;
    fetch(`https://safe-dawn-94912-2365567c9819.herokuapp.com/generate-agenda?event_title="${eventTitle}"`, {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      this.isLoading = false;

      // Split the single string into individual agenda details
      if (data.agendas && data.agendas.length > 0) {
        this.generatedAgendaDetails = data.agendas[0].split('\n').map((detail: any) => detail.trim().replace(/^\d+\.\s*/, ''));
        // Add each detail sequentially with a delay
        this.generatedAgendaDetails.forEach((detail, index) => {
          setTimeout(() => {
            this.addagendaInput(detail);
          }, index * 500); // Adjust the delay (1000ms = 1s) as needed
        });
      } else {
        this.generatedAgendaDetails = [];
      }
    })
    .catch(error => {
      console.error('Error generating agenda details:', error);
      this.isLoading = false;
    });
  }

  
}