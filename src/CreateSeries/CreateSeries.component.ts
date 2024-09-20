import { AfterViewInit, Component, ViewChild, ElementRef, QueryList, ViewChildren, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Location } from '@angular/common';
import validator from 'validator';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule  } from '@angular/forms';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-create-series',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './CreateSeries.component.html',
  styleUrl: './CreateSeries.component.css',
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
export class CreateSeriesComponent {
  prepform!: FormGroup;
  agendaform!: FormGroup;
  constructor(private location: Location, private fb: FormBuilder) { }
  @ViewChildren('stepInput') stepInputs!: QueryList<ElementRef>;
  @ViewChild('snameInput') snameInput!: ElementRef;
  @ViewChild('sdescriptionInput') sdescriptionInput!: ElementRef;
  eventName= '';
  currentStep = 0;
  isAPILoading = false;
  isLoading = false;
  isNameEmpty = false;
  isDescriptionEmpty = false;
  isstep2Empty = false;
  generatedseriesDescriptions: string[] = [];
  showsuccessToast = false;
  showfailToast = false;
  uniqueSocialClubs: any[] = [];
  checkedSocialClubs: any[] = [];
  allClubsChecked = false;
  socialClubs: any[] = [];
  otherCheckboxes: boolean[] = [];
  events: any[] = [];
  filteredEvents: any[] = [];
  selectedEventIds: number[] = [];
  allEventsSelected = false;
  submit(){
    // Create the event object
    this.isAPILoading = true;

    const eventSeries = {
      name: validator.escape(this.snameInput.nativeElement.value),
      description: validator.escape(this.sdescriptionInput.nativeElement.value),
      seriesEventIds: JSON.parse(sessionStorage.getItem('selectedEventIds') || '[]'),
      hostId: localStorage.getItem('ID')
    };

    // Send the POST request
    fetch('https://events-system-back.wn.r.appspot.com/api/eventseries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventSeries)
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
ngOnInit() {
  const storedEventIds = sessionStorage.getItem('selectedEventIds');
  if (storedEventIds) {
    this.selectedEventIds = JSON.parse(storedEventIds);
  }
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
    });
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
onRowClick(eventId: number): void {
  const customEvent = {
    target: {
      checked: !this.isEventSelected(eventId)
    }
  } as unknown as Event; // Cast to unknown first, then to Event

  this.onEventSelectionChange(customEvent, eventId);
}

  // Add a variable to save the input values
  inputValues: string[] = [];
  isTransitioningToPreviousStep = false;
  loadDataFromSessionStorage1() {
    const namedata = sessionStorage.getItem('sName');
    if (namedata) {
      this.snameInput.nativeElement.value = namedata;
    }
  }
  loadDataFromSessionStorage2() {
    const descriptiondata = sessionStorage.getItem('sDescription');
    if (descriptiondata) {
      this.sdescriptionInput.nativeElement.value = descriptiondata;
    }
  }



  loadDataFromSessionStorage5() {
    this.loadDataFromSessionStorage1();
    this.loadDataFromSessionStorage2();
  }
  ngAfterViewChecked() {
    if (this.currentStep === 0 && this.snameInput && this.snameInput.nativeElement && this.snameInput.nativeElement.offsetParent !== null) {
      this.loadDataFromSessionStorage1();
    } else if (this.currentStep === 1 && this.sdescriptionInput && this.sdescriptionInput.nativeElement && this.sdescriptionInput.nativeElement.offsetParent !== null) {
      this.loadDataFromSessionStorage2();
    } else if (this.currentStep === 3 && this.snameInput && this.snameInput.nativeElement.offsetParent !== null) {
      this.loadDataFromSessionStorage5();
    }

  }
  ngAfterViewInit() {
    const namedata = sessionStorage.getItem('Name');
    if (namedata) {
      this.snameInput.nativeElement.value = namedata;
    }
  }
  onEventSelectionChange(event: Event, eventId: number) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectedEventIds.push(eventId);
    } else {
      this.selectedEventIds = this.selectedEventIds.filter(id => id !== eventId);
    }
    sessionStorage.setItem('selectedEventIds', JSON.stringify(this.selectedEventIds));
    this.allEventsSelected = this.selectedEventIds.length === this.events.length;
  }
  isEventSelected(eventId: number): boolean {
    return this.selectedEventIds.includes(eventId);
  }

  onSelectAllChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.allEventsSelected = target.checked;
    this.selectedEventIds = this.allEventsSelected ? this.events.map(event => event.eventId) : [];
    sessionStorage.setItem('selectedEventIds', JSON.stringify(this.selectedEventIds));
  }
  nextStep() {
    if ( this.snameInput.nativeElement.value === '') {
      this.isNameEmpty = true;
      return;
    }
    if (this.currentStep < 4) {
      const nameinput = this.snameInput.nativeElement.value;
      sessionStorage.setItem(`sName`, nameinput);
      this.isNameEmpty = false;
      this.currentStep++;
    }
  }
  nextStep1(){
    if ( this.sdescriptionInput.nativeElement.value === '') {
      this.isDescriptionEmpty = true;
      return;
    }
    if (this.currentStep < 4) {
      const descriptioninput = this.sdescriptionInput.nativeElement.value;
      sessionStorage.setItem(`sDescription`, descriptioninput);
      this.isDescriptionEmpty = false;
      this.currentStep++;
    }
  }
  nextStep2(){

    if (this.currentStep < 4) {
      this.isstep2Empty = false;

      this.currentStep++;
    }
  }
  nextStep3() {
    if (this.currentStep < 4) {
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
  }
  goBack(): void {
    window.history.back();
  }
  isseriesDescriptionSelected = false;
  selectedseriesDescription = '';
  selectseriesDescription(description: string) {
    this.sdescriptionInput.nativeElement.value = description;
    this.selectedseriesDescription = description;
    this.isseriesDescriptionSelected = true;
  }

  
  clearseriesDescription() {
    this.selectedseriesDescription = '';
    this.isseriesDescriptionSelected = false;
    this.sdescriptionInput.nativeElement.value = '';
  }
  suggestseriesDescriptions() {
    console.log(sessionStorage.getItem('sName'));
    const name = sessionStorage.getItem('sName');
    if (!name) {
      window.alert("series title is required to generate description suggestions");
      return;
    }
    this.isLoading = true; // Set loading state to true
    fetch(`https://safe-dawn-94912-2365567c9819.herokuapp.com/generate-series-descriptions?series_title="${name}"`, {
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
        this.generatedseriesDescriptions = [];
        
        // Add each description sequentially with a delay
        descriptions.forEach((description: any, index: any) => {
          setTimeout(() => {
            this.generatedseriesDescriptions.push(description);
            // Trigger change detection if necessary
          }, index * 500); // Adjust the delay (5000ms = 5s) as needed
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
}
