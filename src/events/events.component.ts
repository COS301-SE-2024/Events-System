import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from 'src/Components/event/event.component';
import { EventCardComponent } from 'src/Components/EventCard/eventCard.component';
import { GhostEventCardComponent } from 'src/Components/GhostEventCard/GhostEventCard.component';
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, EventComponent, EventCardComponent, GhostEventCardComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})

export class EventsComponent implements OnInit{
  @ViewChild('dateInput') dateInput!: ElementRef;
  events: any[] = [];
  selectedDate = '';
  searchLocation = '';
  searchTerm = '';
  uniqueSocialClubs: string[] = [];
checkedSocialClubs: string[] = [];
  filteredEvents = this.events;
  isLoading = true;
  event = {
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
    location: '',
    hostId: '',
    geolocation: '',
    socialClub: ''
  };  
  allClubsChecked = false;
  otherCheckboxes = [false, false, false]; // Adjust this to match the number of your other checkboxes
  ngAfterViewInit() {
    this.dateInput.nativeElement.addEventListener('input', () => {
      this.filterEvents();
    });
  }

  onSubmit() {
    const dateInput = (<HTMLInputElement>document.getElementById('date-input')).value;
    console.log(dateInput);
    // You can now use the dateInput value for your needs
    this.selectedDate = dateInput;
    this.onDateChange();
  }

  ngOnInit(): void {
    fetch('https://events-system-back.wn.r.appspot.com/api/events')
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.events = Array.isArray(data) ? data : [data];
        this.uniqueSocialClubs = [...new Set(this.events.map(event => event.socialClub))];
        this.filterEvents();
        this.isLoading = false;
      });
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
    this.filterEvents();
    if (this.otherCheckboxes[i]) {
      this.allClubsChecked = false;
    }
  }
  handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.selectedDate = target.value;
      this.onDateChange();
    }
  }


  selectSocialClub(socialClub: string) {
    this.filteredEvents = this.events.filter(event => event.socialClub === socialClub);
  }
  
  filterEvents() {
    if (this.checkedSocialClubs.length > 0) {
      this.filteredEvents = this.events.filter(event => 
        this.checkedSocialClubs.includes(event.socialClub) &&
        (!this.selectedDate || new Date(event.startDate).toDateString() === new Date(this.selectedDate).toDateString()) &&
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        event.location.toLowerCase().includes(this.searchLocation.toLowerCase())
      );
    } else {
      this.filteredEvents = this.events.filter(event => 
        (!this.selectedDate || new Date(event.startDate).toDateString() === new Date(this.selectedDate).toDateString()) &&
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        event.location.toLowerCase().includes(this.searchLocation.toLowerCase())
      );
    }
  }
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
  onAllClubsClick() {
    if (this.allClubsChecked) {
      this.otherCheckboxes = this.otherCheckboxes.map(() => false);
      this.checkedSocialClubs = [];
    } else {
      this.checkedSocialClubs = [...this.uniqueSocialClubs];
    }
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
      event.location.toLowerCase().includes(this.searchLocation.toLowerCase())
    );
  }
  
}