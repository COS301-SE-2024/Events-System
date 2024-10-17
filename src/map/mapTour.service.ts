// tour.service.ts
import { Injectable } from '@angular/core';
import { driver, Side } from 'driver.js';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class MapTourService {
  private eventdriverObj = driver({
    popoverClass: 'driverjs-theme',
    showProgress: true,

    steps: [
      { 
        
        popover: { 
          title: 'Map page', 
          description: 'This page helps you find locations close to you or in convenient places in a more familiar format',
        } 
      },
      { 
        element: '#search', 
        popover: { 
          title: 'Search', 
          description: 'Looking for a specific event? try using the search functionality to find it',
        } 
      },
      { 
        element: '#filter', 
        popover: { 
          title: 'Filter', 
          description: 'Filter by series, or social club, based on your preferences',
        } 
      },

    ],
  });

  startTour() {
    this.eventdriverObj.drive();
  }

}