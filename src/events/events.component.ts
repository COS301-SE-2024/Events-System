import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from 'src/Components/event/event.component';
import { EventCardComponent } from 'src/Components/EventCard/eventCard.component';

import { response } from 'express';
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, EventComponent, EventCardComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})

export class EventsComponent{
  // export class EventsComponent implements OnInit{
  events: any[] = [];


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
  onSubmit() {
    const dateInput = (<HTMLInputElement>document.getElementById('date-input')).value;
    console.log(dateInput);
    // You can now use the dateInput value for your needs
  }
  onAllClubsClick() {
    if (this.allClubsChecked) {
      this.otherCheckboxes = this.otherCheckboxes.map(() => false);
    }
  }
  onOtherClubClick(index: number) {
    if (this.otherCheckboxes[index]) {
      this.allClubsChecked = false;
    }
  }

  // ngOnInit(): void {
  //   fetch('https://events-system-back.wn.r.appspot.com/api/events')
  //     .then(response => {
  //       return response.json();
  //     })
  //     .then(data => {
  //       this.events = Array.isArray(data) ? data : [data];
  //     });
  // }
 
}