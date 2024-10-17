// tour.service.ts
import { Injectable } from '@angular/core';
import { driver, Side } from 'driver.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EventsTourService {
  constructor(private router: Router){}

  private eventdriverObj = driver({
    popoverClass: 'driverjs-theme',
    showProgress: true,
    onPopoverRender: (popover, { config, state }) => {
      if(this.eventdriverObj.isLastStep()){
                    // Add the "Don't show again" button
        const eventtourbutton = document.createElement('button');
        eventtourbutton.innerText = "take the tour";
        eventtourbutton.className = 'dont-show-again-btn';
        // popover.previousButton.remove();
        popover.footerButtons.appendChild(eventtourbutton);

        eventtourbutton.addEventListener('click', () => {
          this.openEventTour();
        });
      }
      
    },
    steps: [
      { 
        
        popover: { 
          title: 'Events page', 
          description: 'Welcome to the events page, this is where you\'ll find all the events current and upcoming',
          
        } 
        
      },
      { 
        element: '#event-container', 
        popover: { 
          title: 'Events', 
          description: 'All the events in the system, with some useful information to help you make a decision',
        } 
      },
      { 
        element: '#filters', 
        popover: { 
          title: 'Filters', 
          description: 'The filters allow you to filter on your own preferences',
        } 
      },
      { 
        element: '#Recommended-events', 
        popover: { 
          title: 'Recommend events', 
          description: 'This will recommend events based on multiple non-sensitive criteria including our most popular events, the pages you visit, and events you\'ve attended in the past',
        } 
      },
      { 
        element: '#event-book', 
        popover: { 
          title: 'Booking an event', 
          description: 'clicking this will take you to a detailed view of all the events information',
        } 
      },
    ],
  });

  startTour() {
    this.eventdriverObj.drive();
  }
  openEventTour() {
    this.eventdriverObj.destroy(); // Ensure the homepage tour is destroyed
    const eventNum = sessionStorage.getItem('firstEventID');
    this.router.navigate(['/event', eventNum], { queryParams: { startTour: 'true' } });
  }
}