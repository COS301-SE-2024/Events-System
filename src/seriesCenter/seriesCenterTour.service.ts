// tour.service.ts
import { Injectable } from '@angular/core';
import { driver, Side } from 'driver.js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class seriesCenterTourService {
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
          title: 'Series page', 
          description: 'The series page holds our short term collection of events, which take place over a set amount of time',
          
        } 
      },
      { 
        element: '#series', 
        popover: { 
          title: 'Series', 
          description: 'All the series in the system will be presented on this page',
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
        element: '#ind-series', 
        popover: { 
          title: 'Viewing a series', 
          description: 'Clicking this will take you to a detailed view of the series\'s information',
        } 
      },
    ],
  });

  startTour() {
    this.eventdriverObj.drive();
  }
  openEventTour() {
    this.eventdriverObj.destroy(); // Ensure the homepage tour is destroyed
    const seriesNum = sessionStorage.getItem('firstseriesID');
    this.router.navigate(['/series', seriesNum], { queryParams: { startTour: 'true' } });
  }
}