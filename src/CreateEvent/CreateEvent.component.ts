import { AfterViewInit, Component, ViewChild, ElementRef, QueryList, ViewChildren, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Location } from '@angular/common';
import validator from 'validator';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
  ]
})
export class CreateEventComponent implements AfterViewInit{
  prepform!: FormGroup;
  agendaform!: FormGroup;
  constructor(private location: Location, private fb: FormBuilder) { }
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
  eventName= '';
  currentStep = 0;
  isAPILoading = false;
  isNameEmpty = false;
  isDescriptionEmpty = false;
  isstep2Empty = false;
  showsuccessToast = false;
  showfailToast = false;
ngOnInit() {
  // const prepInputsData = sessionStorage.getItem('PrepInputs');
  // const agendaInputsData = sessionStorage.getItem('AgendaInputs');
  this.prepform = this.fb.group({
    prepinputs: this.fb.array([])
  });
  this.agendaform = this.fb.group({
    agendainputs: this.fb.array([])
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
  // this.Prepinputs = prepInputsData ? JSON.parse(prepInputsData) : [];
  // this.Agendainputs = agendaInputsData ? JSON.parse(agendaInputsData) : [];
  this.isVegetarianSelected = sessionStorage.getItem('isVegetarianSelected') === 'false';
  this.isVeganSelected = sessionStorage.getItem('isVeganSelected') === 'false';
  this.isHalalSelected = sessionStorage.getItem('isHalalSelected') === 'false';
  this.isGlutenFreeSelected = sessionStorage.getItem('isGlutenFreeSelected') === 'false';
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
submit(){
    // Create the event object
    this.isAPILoading = true;
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
      eventAgendas: this.agendaform.get('agendaInputs')?.value.map((input: any) => validator.escape(input)),
      eventPreparation: this.prepform.get('prepInputs')?.value.map((input: any) => validator.escape(input)),
      eventDietaryAccommodations: [
        this.isVegetarianSelected ? "Vegetarian" : null,
        this.isVeganSelected ? "Vegan" : null,
        this.isHalalSelected ? "Halal" : null,
        this.isGlutenFreeSelected ? "Gluten-free" : null
      ].filter(Boolean) // Remove null values
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
    if (Locationdata) {
      this.LocationInput.nativeElement.value = Locationdata;
    }
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
    }
  }
  nextStep2(){
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
  }
  goBack(): void {
    window.history.back();
  }
  isVegetarianSelected = false;
  isVeganSelected = false;
  isHalalSelected = false;
  isGlutenFreeSelected = false;

  // Add these methods
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
}
