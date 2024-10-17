// tour.service.ts
import { Injectable, EventEmitter } from '@angular/core';
import { driver, Side } from 'driver.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CreateEventTourService {
    public fillEventName = new EventEmitter<string>();
    public fillDescriptionName = new EventEmitter<string>();
    public clickNextButton = new EventEmitter<void>();
    public clickNextButton2 = new EventEmitter<void>();
    public clickPrev = new EventEmitter<void>();
  private eventdriverObj = driver({
    popoverClass: 'driverjs-theme',
    showProgress: true,

    steps: [
      { 
        popover: { 
          title: 'Creating an event', 
          description: 'This page is where the magic happens! to get started we\'ll name the event',
          
        } 
      },
      { 
        element: '#name-event', 
        popover: { 
          title: 'Naming an event', 
          description: 'Get started with something creative, to capture an employee\'s attention!',
          onNextClick:() => {
            this.fillEventName.emit('Sample Event Name');
            this.eventdriverObj.moveNext();
          }
        } 
      },
      { 
        element: '#next1', 
        popover: { 
          title: 'Confirmation', 
          description: 'Once you\'re sure about your title, move on to the description',
          onNextClick:() => {
            this.clickNextButton.emit();
            this.eventdriverObj.moveNext();
          }
        } 
      },
      { 
        popover: { 
          title: 'Adding a description', 
          description: 'Let\'s add a description!',
        } 
      },
      { 
        element: '#description', 
        popover: { 
          title: 'Describing the event', 
          description: 'Be sure to make it something interesting!',
          onNextClick:() => {
            this.fillDescriptionName.emit('This is a new description for a sample event name');
            this.eventdriverObj.moveNext();
          }
        } 
      },
      { 
        element: '#suggest', 
        popover: { 
          title: 'Generating suggestions', 
          description: 'Anywhere you see this icon, Our event assistant can generate suggested event information based on your title!',
        } 
      },
      { 
        element: '#Back', 
        popover: { 
          title: 'Rewind!', 
          description: 'At any point, you can opt to go back to a previous page',
          onNextClick:() => {
            this.clickPrev.emit();
            this.eventdriverObj.moveNext();
            this.refreshTour();
          }
        } 
      },
      { 
        element: '#name-event', 
        popover: { 
          title: 'Back to basics!', 
          description: 'whether you move forward or back, the changes you make will be saved, up to the point that you create the event!',
        } 
      },
    ],
  });



  startTour() {
    this.eventdriverObj.drive();
  }

  refreshTour() {
    this.eventdriverObj.refresh();
  }
}