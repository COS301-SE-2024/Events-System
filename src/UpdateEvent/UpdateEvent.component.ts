import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Location } from '@angular/common';
import validator from 'validator';

import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
export class UpdateEventComponent implements OnInit, AfterViewChecked{
  prepform!: FormGroup;
  agendaform!: FormGroup;

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
  constructor(private route: ActivatedRoute, private location: Location, private fb: FormBuilder) {
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
      console.log('agendaform' + this.agendaform.value);
      console.log('prepform' + this.prepform.value);
      console.log('prepInputs' + this.prepinputs.value);
      console.log('agendaInputs' + this.agendainputs.value);
      const event = {
        title: validator.escape(this.nameInput.nativeElement.value),
        description: validator.escape(this.descriptionInput.nativeElement.value),
        startTime: validator.escape(this.StartTimeInput.nativeElement.value+':00'),
        endTime: validator.escape(this.EndTimeInput.nativeElement.value+':00'),
        startDate: validator.escape(this.StartDateInput.nativeElement.value),
        endDate: validator.escape(this.EndDateInput.nativeElement.value),
        location: validator.escape(this.LocationInput.nativeElement.value),

        hostId: localStorage.getItem('ID'),
        geolocation: "51.507351, -0.127758",
        socialClub: validator.escape(this.SocialClubInput.nativeElement.value),
        eventPictureLink: "https://example.com/soccer-tournament.jpg", // Replace with actual picture link
        eventAgendas: this.agendainputs?.value.map((input: any) => validator.escape(input)),
        eventPreparation: this.prepinputs?.value.map((input: any) => validator.escape(input)),
        
        eventDietaryAccommodations: [
          sessionStorage.getItem('updateisVegetarianSelected') === 'true' ? "Vegetarian" : null,
          sessionStorage.getItem('updateisVeganSelected') === 'true' ? "Vegan" : null,
          sessionStorage.getItem('updateisHalalSelected') === 'true' ? "Halal" : null,
          sessionStorage.getItem('updateisGlutenFreeSelected') === 'true' ? "Gluten-free" : null
        ].filter(Boolean) // Remove null values
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
  this.nameInput.nativeElement.value = sessionStorage.getItem('Name');
  this.descriptionInput.nativeElement.value = sessionStorage.getItem('Description');
  this.StartTimeInput.nativeElement.value = sessionStorage.getItem('StartTime');
  this.EndTimeInput.nativeElement.value = sessionStorage.getItem('EndTime');
  this.StartDateInput.nativeElement.value = sessionStorage.getItem('StartDate');
  this.EndDateInput.nativeElement.value = sessionStorage.getItem('EndDate');
  this.LocationInput.nativeElement.value = sessionStorage.getItem('Location');
  this.SocialClubInput.nativeElement.value = sessionStorage.getItem('SocialClub');
}

addagendaInput(value = '') {
  if (this.agendainputs.length < 5) {
    this.agendainputs.push(this.fb.control(value));
  }
  this.nameInput.nativeElement.value = sessionStorage.getItem('Name');
  this.descriptionInput.nativeElement.value = sessionStorage.getItem('Description');
  this.StartTimeInput.nativeElement.value = sessionStorage.getItem('StartTime');
  this.EndTimeInput.nativeElement.value = sessionStorage.getItem('EndTime');
  this.StartDateInput.nativeElement.value = sessionStorage.getItem('StartDate');
  this.EndDateInput.nativeElement.value = sessionStorage.getItem('EndDate');
  this.LocationInput.nativeElement.value = sessionStorage.getItem('Location');
  this.SocialClubInput.nativeElement.value = sessionStorage.getItem('SocialClub');
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
  ngOnInit(): void {
    this.route.params.subscribe(params => {   // Get the event ID from the URL
      this.prepform = this.fb.group({
        prepinputs: this.fb.array([])
      });
      this.agendaform = this.fb.group({
        agendainputs: this.fb.array([])
      });

      this.eventId = params['id'];

      fetch('https://events-system-back.wn.r.appspot.com/api/events/' + this.eventId)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.myevent = data;
        console.log(this.myevent);
        this.nameInput.nativeElement.value = sessionStorage.setItem('Name', data.title);
        this.descriptionInput.nativeElement.value = sessionStorage.setItem('Description', data.description);
        this.StartTimeInput.nativeElement.value = sessionStorage.setItem('StartTime', data.startTime);
        this.EndTimeInput.nativeElement.value = sessionStorage.setItem('EndTime', data.endTime);
        this.StartDateInput.nativeElement.value = sessionStorage.setItem('StartDate', data.startDate);
        this.EndDateInput.nativeElement.value = sessionStorage.setItem('EndDate', data.endDate);
        this.LocationInput.nativeElement.value = sessionStorage.setItem('Location', data.location);
        this.SocialClubInput.nativeElement.value = sessionStorage.setItem('SocialClub', data.socialClub);
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
        if (this.myevent && this.myevent.dietaryAccommodations) {
          this.isVegetarianSelected = this.myevent.dietaryAccommodations.includes("Vegetarian");
          sessionStorage.setItem('updateisVegetarianSelected', String(this.isVegetarianSelected));
          this.isVeganSelected = this.myevent.dietaryAccommodations.includes('Vegan');
          sessionStorage.setItem('updateisVeganSelected', String(this.isVeganSelected));
          this.isHalalSelected = this.myevent.dietaryAccommodations.includes('Halal');
          sessionStorage.setItem('updateisHalalSelected', String(this.isHalalSelected));
          this.isGlutenFreeSelected = this.myevent.dietaryAccommodations.includes('Gluten-Free');
          sessionStorage.setItem('updateisGlutenFreeSelected', String(this.isGlutenFreeSelected));
        } else {
          sessionStorage.setItem('updateisVegetarianSelected', 'false');
          sessionStorage.setItem('updateisVeganSelected', 'false');
          sessionStorage.setItem('updateisHalalSelected', 'false');
          sessionStorage.setItem('updateisGlutenFreeSelected', 'false');
        }
              });
    });
    

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
  ngAfterViewChecked(): void {
    if (this.myevent) {
      this.nameInput.nativeElement.value = this.myevent.title;
      this.descriptionInput.nativeElement.value = this.myevent.description;
      this.StartTimeInput.nativeElement.value = this.formatTime(this.myevent.startTime);
      this.EndTimeInput.nativeElement.value = this.formatTime(this.myevent.endTime);
      this.StartDateInput.nativeElement.value = this.myevent.startDate;
      this.EndDateInput.nativeElement.value = this.myevent.endDate;
      this.LocationInput.nativeElement.value = this.myevent.location;
      this.SocialClubInput.nativeElement.value = this.myevent.socialClub;
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
    return this.myevent.dietaryAccommodations.includes(accommodation);
  }
  isVegetarianSelected = false;
  isVeganSelected = false;
  isHalalSelected = false;
  isGlutenFreeSelected = false;

  // Add these methods
  toggleVegetarian() {
    this.isVegetarianSelected = !this.isVegetarianSelected;
    sessionStorage.setItem('updateisVegetarianSelected', String(this.isVegetarianSelected));

  }

  toggleVegan() {
    this.isVeganSelected = !this.isVeganSelected;
    sessionStorage.setItem('updateisVeganSelected', String(this.isVeganSelected));

  }

  toggleHalal() {
    this.isHalalSelected = !this.isHalalSelected;
    sessionStorage.setItem('updateisHalalSelected', String(this.isHalalSelected));

  }

  toggleGlutenFree() {
    this.isGlutenFreeSelected = !this.isGlutenFreeSelected;  sessionStorage.setItem('isGlutenFreeSelected', String(this.isGlutenFreeSelected));
    sessionStorage.setItem('updateisGlutenFreeSelected', String(this.isGlutenFreeSelected));

  }
}
