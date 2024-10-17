// tour.service.ts
import { Injectable, EventEmitter } from '@angular/core';
import { driver, Side } from 'driver.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SocialClubCreateTourService {
    public fillClubName = new EventEmitter<string>();
    public fillSummaryName = new EventEmitter<string>();
    public clickNextButton = new EventEmitter<void>();
    public clickNextButton2 = new EventEmitter<void>();
    public clickPrev = new EventEmitter<void>();
  private eventdriverObj = driver({
    popoverClass: 'driverjs-theme',
    showProgress: true,

    steps: [
      { 
        popover: { 
          title: 'Creating a social club', 
          description: 'Social clubs are important an important feature that allow users to find new interest or find events within their current interests, let\'s take a look at the process of creating one!',
          
        } 
      },
      { 
        element: '#name-input', 
        popover: { 
          title: 'Naming a social club', 
          description: 'Name your social club something that describes the type of events you would like it to host',
          onNextClick:() => {
            this.fillClubName.emit('Sample Social club name');
            this.eventdriverObj.moveNext();
          }
        } 
      },
      { 
        element: '#next1', 
        popover: { 
          title: 'Confirmation', 
          description: 'Once you\'re sure about your name, move on to the summary and description',
          onNextClick:() => {
            this.clickNextButton.emit();
            this.eventdriverObj.moveNext();
          }
        } 
      },
      { 
        popover: { 
          title: 'Adding a description', 
          description: 'Let\'s add a summary & description!',
        } 
      },
      { 
        element: '#summary', 
        popover: { 
          title: 'Describing the Club', 
          description: 'Give a 1 or 2 sentence summary of what your social club is about, what it promotes, etc.',
          onNextClick:() => {
            this.fillSummaryName.emit('This is a summary description of the Sample Social club name');
            this.eventdriverObj.moveNext();
          }
        } 
      },
      { 
        element: '#suggest', 
        popover: { 
          title: 'Generating suggestions', 
          description: 'Anywhere you see this icon, Our event assistant can generate suggested Social club information based on your title!',
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