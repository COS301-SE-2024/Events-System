// tour.service.ts
import { Injectable } from '@angular/core';
import { driver, Side } from 'driver.js';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class SocialClubsTourService {
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
          this.openSocialClubTour();
        });
      }
      
    },
    steps: [
      { 
        
        popover: { 
          title: 'Social Clubs', 
          description: 'This page is for showcasing the collection of social clubs currently in the system, let\'s take a look around!',
          
        } 
        
      },
      { 
        element: '#search-bar', 
        popover: { 
          title: 'Search', 
          description: 'This allows you to search for a social club by name or creator',
        } 
      },
      { 
        element: '#socials ', 
        popover: { 
          title: 'Social clubs', 
          description: 'Social clubs are categories of events that can be used for expanding on your own personal tastes',
              side: "top",
              align: 'center'
        } 
      },
      { 
        element: '#clubcard', 
        popover: { 
          title: 'Social club ', 
          description: 'This is a social club, clicking or hovering over it will show a brief description about it, and clicking See more, will show you the events it has hosted and will be hosting!',
        } 
      },
    ],
  });

  startTour() {
    this.eventdriverObj.drive();
  }
  openSocialClubTour() {
    this.eventdriverObj.destroy(); // Ensure the homepage tour is destroyed
    const clubNum = sessionStorage.getItem('firstSocialclubID');
    this.router.navigate(['/socialclub', clubNum], { queryParams: { startTour: 'true' } });
  }
}