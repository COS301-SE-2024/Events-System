import { AfterViewInit, Component, ViewChild, ElementRef, QueryList, ViewChildren, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Location } from '@angular/common';
@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule],
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
  ]
})
export class CreateEventComponent implements AfterViewInit{
  constructor(private location: Location) { }
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
  stepInputsArray: ElementRef[] = [];
  eventName= '';
  currentStep = 0;
  isAPILoading = false;
  showsuccessToast = false;
  showfailToast = false;
// Define the Prepinputs and Agendainputs as an array of objects
Prepinputs: { id: number, value: string }[] = [{ id: 0, value: '' }];
Agendainputs: { id: number, value: string }[] = [{ id: 0, value: '' }];
ngOnInit() {
  const prepInputsData = sessionStorage.getItem('PrepInputs');
  const agendaInputsData = sessionStorage.getItem('AgendaInputs');
  this.Prepinputs = prepInputsData ? JSON.parse(prepInputsData) : [];
  this.Agendainputs = agendaInputsData ? JSON.parse(agendaInputsData) : [];
  this.isVegetarianSelected = sessionStorage.getItem('isVegetarianSelected') === 'true';
  this.isVeganSelected = sessionStorage.getItem('isVeganSelected') === 'true';
  this.isHalalSelected = sessionStorage.getItem('isHalalSelected') === 'true';
  this.isGlutenFreeSelected = sessionStorage.getItem('isGlutenFreeSelected') === 'true';
}
submit(){
    // Create the event object
    this.isAPILoading = true;
    const event = {
      title: this.nameInput.nativeElement.value,
      description: this.descriptionInput.nativeElement.value,
      startTime: this.StartTimeInput.nativeElement.value+':00',
      endTime: this.EndTimeInput.nativeElement.value+':00',
      startDate: this.StartDateInput.nativeElement.value,
      endDate: this.EndDateInput.nativeElement.value,
      location: this.LocationInput.nativeElement.value,
      hostId: 6,
      geolocation: "51.507351, -0.127758", // Replace with actual geolocation
      socialClub: 2,
      eventPictureLink: "https://example.com/soccer-tournament.jpg", // Replace with actual picture link
      eventAgendas: this.Agendainputs.map(input => input.value),
      eventPreparation: this.Prepinputs.map(input => input.value),
      eventDietaryAccommodations: [
        this.isVegetarianSelected ? "Vegetarian" : null,
        this.isVeganSelected ? "Vegan" : null,
        this.isHalalSelected ? "Halal" : null,
        this.isGlutenFreeSelected ? "Gluten-free" : null
      ].filter(Boolean) // Remove null values
    };
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
    // Retrieve the PrepInputs and AgendaInputs
    const prepInputsData = sessionStorage.getItem('PrepInputs');
    const agendaInputsData = sessionStorage.getItem('AgendaInputs');
    if (prepInputsData) {
      this.Prepinputs = JSON.parse(prepInputsData);
    }
    if (agendaInputsData) {
      this.Agendainputs = JSON.parse(agendaInputsData);
    }
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
    if (this.currentStep === 0 && this.nameInput && this.nameInput.nativeElement.offsetParent !== null) {
      this.loadDataFromSessionStorage1();
    } else if (this.currentStep === 1 && this.descriptionInput && this.descriptionInput.nativeElement.offsetParent !== null) {
      this.loadDataFromSessionStorage2();
    }else if (this.currentStep === 2 && this.StartTimeInput && this.StartTimeInput.nativeElement.offsetParent !== null) {
      this.loadDataFromSessionStorage3();
    }else if (this.currentStep === 3 && this.PrepInputs && this.PrepInputs.first.nativeElement.offsetParent !== null) {
      this.loadDataFromSessionStorage4();
    }
    else if (this.currentStep === 4 && this.nameInput && this.StartTimeInput && this.nameInput.nativeElement.offsetParent !== null) {
      this.loadDataFromSessionStorage5();

    }
    // Add other conditions for other steps
  }

  ngAfterViewInit() {
    const namedata = sessionStorage.getItem('Name');
    if (namedata) {
      this.nameInput.nativeElement.value = namedata;
    }
  }
  nextStep() {
    if (this.currentStep < 4) {
      const nameinput = this.nameInput.nativeElement.value;
      sessionStorage.setItem(`Name`, nameinput);
      this.currentStep++;
    }
  }
  nextStep1(){
    if (this.currentStep < 4) {
      const descriptioninput = this.descriptionInput.nativeElement.value;
      sessionStorage.setItem(`Description`, descriptioninput);
      this.currentStep++;
    }
  }
  nextStep2(){
    if (this.currentStep < 4) {
      const starttimeinput = this.StartTimeInput.nativeElement.value;
      const endtimeinput = this.EndTimeInput.nativeElement.value;
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
      this.currentStep++;
    }
  }
  nextStep3() {
    if (this.currentStep < 4) {
      sessionStorage.setItem('PrepInputs', JSON.stringify(this.Prepinputs));
      sessionStorage.setItem('AgendaInputs', JSON.stringify(this.Agendainputs));
  
      this.currentStep++;
    }
  }
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  addPrepInput() {
    this.Prepinputs.push({ id: this.Prepinputs.length, value: '' });
  }

  updatePrepInput(index: number, event: any) {
    if (this.Prepinputs[index]) {
      this.Prepinputs[index].value = event.target.value;
    }
  }
  
  addAgendaInput() {
    this.Agendainputs.push({ id: this.AgendaInputs.length, value: '' });
  }
  updateAgendaInput(index: number, event: any) {
    if (this.Agendainputs[index]) {
      this.Agendainputs[index].value = event.target.value;
    }
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
