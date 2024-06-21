import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import {  } from '@angular/router';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-my-events-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './MyEventsCard.component.html',
  styleUrl: './MyEventsCard.component.css',
})
export class MyEventsCardComponent implements OnChanges {
  constructor(private route: ActivatedRoute, private location: Location) { }  goBack(): void {
    window.history.back();
  }
  eventId= '';
  isAPILoading = false;
  showsuccessToast = false;
  showfailToast = false;
  submit(){
    this.isAPILoading = true; // Set isLoading to true at the start of the method


      // this.eventID = params['id'];
      // Send the POST request
      console.log(this.eventId);
      console.log(Number(this.ID));
      console.log(this.eventID);
      console.log(this.eventString);
      const eventIds = this.eventString.split('/')[0]; // splits the string into an array and takes the first element
      console.log(eventIds)
      fetch(`https://events-system-back.wn.r.appspot.com/api/events/${eventIds}+12121`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{}'
      })
      .then(() => {
        // Show the success toast
        this.showsuccessToast = true;
        this.isAPILoading = false;
        // Hide the toast after 5 seconds
        setTimeout(() => {
          this.showsuccessToast = false;
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
  @Input() eventID: any | undefined;
  @Input() eventString: any | undefined;
  @Input() eventTitle: any | undefined;
  @Input() ID: number | undefined;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['eventID']) {
      console.log(changes['eventID'].currentValue); // Should log the updated eventID
    }
  }
}
