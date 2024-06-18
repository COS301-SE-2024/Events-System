import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
@Component({
  selector: 'app-update-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './UpdateEvent.component.html',
  styleUrl: './UpdateEvent.component.css',
})
export class UpdateEventComponent implements OnInit, AfterViewChecked{


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
Prepinputs: { id: number, value: string }[] = [{ id: 0, value: '' }];
Agendainputs: { id: number, value: string }[] = [{ id: 0, value: '' }];
  eventId= '';
  myevent: any = null;
  host: any = null;
  isLoading = true;
  isAPILoading = false;
  showsuccessToast = false;
  eventDietaryAccommodations: string[] = [];
  showfailToast = false;
  constructor(private route: ActivatedRoute, private location: Location) { }  goBack(): void {
    window.history.back();
  }

  submit(){
    this.isAPILoading = true; // Set isLoading to true at the start of the method

    this.route.params.subscribe(params => {
      this.eventId = params['id'];
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
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];

      fetch('https://events-system-back.wn.r.appspot.com/api/events/' + this.eventId)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.myevent = data;
        console.log(this.myevent);
        this.Prepinputs = this.myevent.eventPreparation.map((prep: any, index: number) => ({ id: index, value: prep }));
        this.Agendainputs = this.myevent.eventAgendas.map((agenda: any, index: number) => ({ id: index, value: agenda }));
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
          // Handle the case where this.myevent or this.myevent.dietaryAccommodations is undefined
          // For example, you could set all the session storage items to 'false'
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