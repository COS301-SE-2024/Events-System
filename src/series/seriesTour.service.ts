// tour.service.ts
import { Injectable } from '@angular/core';
import { driver, Side } from 'driver.js';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class SeriesTourService {
  private eventdriverObj = driver({
    popoverClass: 'driverjs-theme',
    showProgress: true,

    steps: [
      { 
        
        popover: { 
          title: 'Series page', 
          description: 'This page gives you insight into a series, and all it\'s events',
          
        } 
        
      },
      { 
        element: '#host', 
        popover: { 
          title: 'Host', 
          description: 'This tells you who hosts the series with the ability to view their profile',
        } 
      },
      { 
        element: '#events', 
        popover: { 
          title: 'Events', 
          description: 'This shows you all the events within the series',
        } 
      },

    ],
  });

  startTour() {
    this.eventdriverObj.drive();
  }

}