// tour.service.ts
import { Injectable } from '@angular/core';
import { driver, Side } from 'driver.js';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class SocialClubTourService {
  private eventdriverObj = driver({
    popoverClass: 'driverjs-theme',
    showProgress: true,

    steps: [
      { 
        
        popover: { 
          title: 'Social club page', 
          description: 'This page gives you insight into a social club, who hosts it, and it\'s events',
          
        } 
        
      },
      { 
        element: '#host', 
        popover: { 
          title: 'Host', 
          description: 'This tells you who hosts the event with the ability to view their profile',
        } 
      },
      { 
        element: '#events', 
        popover: { 
          title: 'Event details', 
          description: 'This is where the events the social club has and will host are located',
        } 
      },

    ],
  });

  startTour() {
    this.eventdriverObj.drive();
  }

}