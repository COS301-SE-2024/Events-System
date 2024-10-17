// tour.service.ts
import { Injectable } from '@angular/core';
import { driver, Side } from 'driver.js';
import { SidebarService } from 'src/app/sidebar.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TourService {
    constructor(private sidebarservice: SidebarService,private router: Router){}
  private driverObj = driver({
    popoverClass: 'driverjs-theme',
    showProgress: true,
    prevBtnText: '←',
    onPopoverRender: (popover, { config, state }) => {
        if (this.driverObj.isFirstStep()) { // Check if the current step is the first one
  
          // Add the "Don't show again" button
          const dontShowAgainButton = document.createElement('button');
          dontShowAgainButton.innerText = "Don't show again";
          dontShowAgainButton.className = 'dont-show-again-btn';
          popover.previousButton.remove();
          popover.footerButtons.appendChild(dontShowAgainButton);
  
          dontShowAgainButton.addEventListener('click', () => {
            this.dontShowAgain();
            this.driverObj.destroy();
          });
        }
        
        if(this.driverObj.getActiveIndex() === 7){
                      // Add the "Don't show again" button
          const eventtourbutton = document.createElement('button');
          eventtourbutton.innerText = "take the tour";
          eventtourbutton.className = 'dont-show-again-btn';
          popover.footerButtons.appendChild(eventtourbutton);
  
          eventtourbutton.addEventListener('click', () => {
            this.openEventsTour();
          });
        }
        if(this.driverObj.getActiveIndex() === 8){
          // Add the "Don't show again" button
        const eventtourbutton = document.createElement('button');
        eventtourbutton.innerText = "take the tour";
        eventtourbutton.className = 'dont-show-again-btn';
        popover.footerButtons.appendChild(eventtourbutton);

        eventtourbutton.addEventListener('click', () => {
        this.openSocialClubsTour();
        });
        }
        if(this.driverObj.getActiveIndex() === 9){
          // Add the "Don't show again" button
        const eventtourbutton = document.createElement('button');
        eventtourbutton.innerText = "take the tour";
        eventtourbutton.className = 'dont-show-again-btn';
        popover.footerButtons.appendChild(eventtourbutton);

        eventtourbutton.addEventListener('click', () => {
        this.openSeriesTour();
        });
        }
        if(this.driverObj.getActiveIndex() === 12){
          // Add the "Don't show again" button
        const eventtourbutton = document.createElement('button');
        eventtourbutton.innerText = "take the tour";
        eventtourbutton.className = 'dont-show-again-btn';
        popover.footerButtons.appendChild(eventtourbutton);

        eventtourbutton.addEventListener('click', () => {
        this.openMapTour();
        });
        }

        if(this.driverObj.getActiveIndex() === 14){
          // Add the "Don't show again" button
        const eventtourbutton = document.createElement('button');
        eventtourbutton.innerText = "take the tour";
        eventtourbutton.className = 'dont-show-again-btn';
        popover.footerButtons.appendChild(eventtourbutton);

        eventtourbutton.addEventListener('click', () => {
        this.openMyEventsTour();
        });
        }
        if(this.driverObj.getActiveIndex() === 15){
          // Add the "Don't show again" button
        const eventtourbutton = document.createElement('button');
        eventtourbutton.innerText = "take the tour";
        eventtourbutton.className = 'dont-show-again-btn';
        popover.footerButtons.appendChild(eventtourbutton);

        eventtourbutton.addEventListener('click', () => {
        this.openMySocialClubsTour();
        });
        }
        if(this.driverObj.getActiveIndex() === 16){
          // Add the "Don't show again" button
        const eventtourbutton = document.createElement('button');
        eventtourbutton.innerText = "take the tour";
        eventtourbutton.className = 'dont-show-again-btn';
        popover.footerButtons.appendChild(eventtourbutton);

        eventtourbutton.addEventListener('click', () => {
        this.openMySeriesTour();
        });
        }
        if(this.driverObj.getActiveIndex() === 19){
          // Add the "Don't show again" button
        const eventtourbutton = document.createElement('button');
        eventtourbutton.innerText = "take the tour";
        eventtourbutton.className = 'dont-show-again-btn';
        popover.footerButtons.appendChild(eventtourbutton);

        eventtourbutton.addEventListener('click', () => {
        this.openSearchTour();
        });
        }
      },
      onNextClick:() => {
        if(this.driverObj.getActiveIndex() === 6){
            this.sidebarservice.openSidebar();
            this.driverObj.moveNext();
        }else if(this.driverObj.getActiveIndex() === 13){
            if(localStorage.getItem('Role') !== 'MANAGER'){
                this.driverObj.moveTo(17);
            }else{
                this.driverObj.moveNext();
            }
        }else{
            this.driverObj.moveNext();
        }
      },
    steps: [
      { 
        
        popover: { 
          title: 'Home page', 
          description: 'Welcome to the Events system, feel free to take the tour',
          
        } 
        
      },
      { 
        element: '#Popular-carousel', 
        popover: { 
          title: 'Popular events', 
          description: 'Here you\'ll find the most popular upcoming events in the system',
        } 
      },
      { 
        element: '#Upcoming-carousel', 
        popover: { 
          title: 'Upcoming events', 
          description: 'This section shows your upcoming events, in chronological order.',
        } 
      },
      { 
        element: '#date-input', 
        popover: { 
          title: 'Home Page', 
          description: 'Use this to find events happening on a certain date',
        } 
      },
      { 
        element: '#social-clubs', 
        popover: { 
          title: 'Social clubs', 
          description: 'Here are some social clubs you might be interested in.',
        } 
      },
      { 
        element: '#chatbot-button', 
        popover: { 
          title: 'Eve', 
          description: 'This is eve, our chatbot, she can help you with event-related activities, like Rsvpying to events, showing events close by, or finding out how to prepare for an event!',
        } 
      },
      { 
        element: '#drawer-button', 
        popover: { 
          title: 'Sidebar', 
          description: 'This is the sidebar. Let\'s explore its options!',
        } 
        
      },
      { 
        element: '#Events-page', 
        popover: { 
          title: 'Events', 
          description: 'This is the events page, it will show all the events created by all the hosts',
        } 
      },
      { 
        element: '#Social-club-page', 
        popover: { 
          title: 'Social clubs', 
          description: 'This is the social clubs page, if you\'re looking for a club with similar interests, this is your first stop!',
        } 
      },
      { 
        element: '#series-page', 
        popover: { 
          title: 'Series', 
          description: 'For a series of events under a common theme, find all of them here',
        } 
      },
      { 
        element: '#notifications-page', 
        popover: { 
          title: 'Notifications', 
          description: 'If any events or series you are RSVP\'d to change, find out here',
        } 
      },
      { 
        element: '#calender-page', 
        popover: { 
          title: 'Calender', 
          description: 'Find all our current and future events on this page, make sure you\'re free!',
        } 
      },
      { 
        element: '#map-page', 
        popover: { 
          title: 'Map', 
          description: 'Want to know what\'s happening close by? find out here!',
        } 
      },
      { 
        element: '#leaderboard-page', 
        popover: { 
          title: 'Leaderboard', 
          description: 'For the ultimate bragging rights, find out who has hosted or attended the most events here',
        } 
      },
      { 
        element: '#myevents-page', 
        popover: { 
          title: 'My events', 
          description: 'The events management hub, for updating, creating and cancelling events',
        } 
      },
      { 
        element: '#mysocialclubs-page', 
        popover: { 
          title: 'My social clubs', 
          description: 'The social clubs management hub, for updating, creating and deleting social clubs',
        } 
      },
      { 
        element: '#myseries-page', 
        popover: { 
          title: 'My series', 
          description: 'The Series management hub, for updating, creating and deleting series',
        } 
      },
      { 
        element: '#schedule-page', 
        popover: { 
          title: 'Schedule', 
          description: 'For a chronological list of all the events you\'ll be attending or have attended in the past',
        } 
      },
      { 
        element: '#Settings-page', 
        popover: { 
          title: 'Settings', 
          description: 'For customization or privacy, find every option you need here',
        } 
      },
      { 
        element: '#Search-page', 
        popover: { 
          title: 'Search', 
          description: 'Whether you need a specific event, or a specific host, find more here',
        } 
      },
      { 
        element: '#Help-page', 
        popover: { 
          title: 'Help', 
          description: 'Whether you have a problem you can\'t solve, or just have a question, Use this for guidance',
        } 
      },
      { 
        element: '#Download-page', 
        popover: { 
          title: 'Download', 
          description: 'If you want to download the app on desktop or android, click this button for quicker access to our site!',
        } 
      },
    ],
  });

  startTour() {
    this.driverObj.drive();
  }

  dontShowAgain() {
    localStorage.setItem('dontShowTour', 'true');
  }

  openEventsTour() {
    this.driverObj.destroy(); // Ensure the homepage tour is destroyed

    
    this.sidebarservice.closeSidebar();
    this.router.navigate(['/events'], { queryParams: { startTour: 'true' } });
  }

  openSocialClubsTour() {
    this.driverObj.destroy(); // Ensure the homepage tour is destroyed

    
    this.sidebarservice.closeSidebar();
    this.router.navigate(['/socialclubs'], { queryParams: { startTour: 'true' } });
  }
  openSeriesTour() {
    this.driverObj.destroy(); // Ensure the homepage tour is destroyed

    
    this.sidebarservice.closeSidebar();
    this.router.navigate(['/seriescenter'], { queryParams: { startTour: 'true' } });
  }
  openMapTour() {
    this.driverObj.destroy(); // Ensure the homepage tour is destroyed

    
    this.sidebarservice.closeSidebar();
    this.router.navigate(['/map'], { queryParams: { startTour: 'true' } });
  }
  openMyEventsTour(){
    this.driverObj.destroy(); // Ensure the homepage tour is destroyed

    
    this.sidebarservice.closeSidebar();
    this.router.navigate(['/myevents'], { queryParams: { startTour: 'true' } });
  }
  openMySocialClubsTour(){
    this.driverObj.destroy(); // Ensure the homepage tour is destroyed

    
    this.sidebarservice.closeSidebar();
    this.router.navigate(['/socialclublisting'], { queryParams: { startTour: 'true' } });
  }
  openMySeriesTour(){
    this.driverObj.destroy(); // Ensure the homepage tour is destroyed

    
    this.sidebarservice.closeSidebar();
    this.router.navigate(['/myseries'], { queryParams: { startTour: 'true' } });
  }
  openSearchTour(){
    this.driverObj.destroy(); // Ensure the homepage tour is destroyed

    
    this.sidebarservice.closeSidebar();
    this.router.navigate(['/search'], { queryParams: { startTour: 'true' } });
  }
}