import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Location } from '@angular/common';
import validator from 'validator';
import { NotificationService } from 'src/app/notification.service';

import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
  isVegetarianSelected = false;
  isVeganSelected = false;
  isHalalSelected = false;
  isGlutenFreeSelected = false;
  tags: string[] = [];
  newTag: string = '';

  constructor(private route: ActivatedRoute, private location: Location, private fb: FormBuilder, private notificationService: NotificationService) {
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
  const savedTags = sessionStorage.getItem('tags');
  const tags = savedTags ? JSON.parse(savedTags) : [];

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
  sessionStorage.setItem('tags', JSON.stringify(this.tags));
}

notify() {
const eventName = sessionStorage.getItem('Name') ?? 'Unknown';
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
    this.route.params.subscribe(params => {   
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
        // console.log(this.myevent);
        this.nameInput.nativeElement.value = sessionStorage.setItem('Name', data.title);
        this.descriptionInput.nativeElement.value = sessionStorage.setItem('Description', data.description);
        this.StartTimeInput.nativeElement.value = sessionStorage.setItem('StartTime', data.startTime);
        this.EndTimeInput.nativeElement.value = sessionStorage.setItem('EndTime', data.endTime);
        this.StartDateInput.nativeElement.value = sessionStorage.setItem('StartDate', data.startDate);
        this.EndDateInput.nativeElement.value = sessionStorage.setItem('EndDate', data.endDate);
        this.LocationInput.nativeElement.value = sessionStorage.setItem('Location', data.location);
        this.SocialClubInput.nativeElement.value = sessionStorage.setItem('SocialClub', data.socialClub);
        if(data.eventDietaryAccommodations.includes('Vegetarian')){
          sessionStorage.setItem('isVegetarianSelected', 'true');
          sessionStorage.setItem('updateisVegetarianSelected', 'true');
        }else{
          sessionStorage.setItem('isVegetarianSelected', 'false');
          sessionStorage.setItem('updateisVegetarianSelected', 'false');
        }
        if(data.eventDietaryAccommodations.includes('Vegan')){
          sessionStorage.setItem('isVeganSelected', 'true');
          sessionStorage.setItem('updateisVeganSelected', 'true');
        }else{
          sessionStorage.setItem('isVeganSelected', 'false');
          sessionStorage.setItem('updateisVeganSelected', 'false');
        }
        if(data.eventDietaryAccommodations.includes('Halal')){
          sessionStorage.setItem('isHalalSelected', 'true');
          sessionStorage.setItem('updateisHalalSelected', 'true');
        }else{
          sessionStorage.setItem('isHalalSelected', 'false');
          sessionStorage.setItem('updateisHalalSelected', 'false');
        }
        if(data.eventDietaryAccommodations.includes('Gluten-free')){
          sessionStorage.setItem('isGlutenFreeSelected', 'true');
          sessionStorage.setItem('updateisGlutenFreeSelected', 'true');
        }else{
          sessionStorage.setItem('isGlutenFreeSelected', 'false');
          sessionStorage.setItem('updateisGlutenFreeSelected', 'false');
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
          sessionStorage.setItem('updateisVegetarianSelected', String(this.isVegetarianSelected));
          this.isVeganSelected = data.dietaryAccommodations.includes('Vegan');
          sessionStorage.setItem('updateisVeganSelected', String(this.isVeganSelected));
          this.isHalalSelected = data.dietaryAccommodations.includes('Halal');
          sessionStorage.setItem('updateisHalalSelected', String(this.isHalalSelected));
          this.isGlutenFreeSelected = data.dietaryAccommodations.includes('Gluten-Free');
          sessionStorage.setItem('updateisGlutenFreeSelected', String(this.isGlutenFreeSelected));
        }

        this.isVegetarianSelected = sessionStorage.getItem('isVegetarianSelected') === 'true';    
        this.isVeganSelected = sessionStorage.getItem('isVeganSelected') === 'true';
        this.isHalalSelected = sessionStorage.getItem('isHalalSelected') === 'true';
        this.isGlutenFreeSelected = sessionStorage.getItem('isGlutenFreeSelected') === 'true';

        sessionStorage.setItem('tags', JSON.stringify(data.tags));

                // Load tags from session storage
        const savedTags = sessionStorage.getItem('tags');
        if (savedTags) {
          this.tags = JSON.parse(savedTags);
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
