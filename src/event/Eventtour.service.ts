// tour.service.ts
import { Injectable } from '@angular/core';
import { driver, Side } from 'driver.js';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class EventTourService {
  private eventdriverObj = driver({
    popoverClass: 'driverjs-theme',
    showProgress: true,

    steps: [
      { 
        
        popover: { 
          title: 'Event page', 
          description: 'This page will give you a detailed look at what an event offers, and where it will be hosted',
          
        } 
        
      },
      { 
        element: '#Hosted-by', 
        popover: { 
          title: 'Host', 
          description: 'This gives a brief description of the social club that is hosting the event, and gives you the ability to find out more about it!',
        } 
      },
      { 
        element: '#event-details', 
        popover: { 
          title: 'Event details', 
          description: 'This gives you the ability to see, The events host, the data, time and location of the event',
        } 
      },
      { 
        element: '#event-host-name', 
        popover: { 
          title: 'Event host', 
          description: 'selecting a hosts name will direct you to their profile',
        } 
      },
      { 
        element: '#Dietary-accomodations', 
        popover: { 
          title: 'Dietary accomodations', 
          description: 'The accomodations listed are the dietary categories that the host has indicated will be accomodated for, if your accomodation is not listed, we advise against attending, or, bring your own snacks!',
        } 
      },
      { 
        element: '#tags', 
        popover: { 
          title: 'Tags', 
          description: 'Tags are special keywords you can use to search for similar events that contain a similar tag',
        } 
      },
      { 
        element: '#ind-tags', 
        popover: { 
          title: 'Searching tags', 
          description: 'selecting a tag directs you to the search page which allows you to search for events with a similar tag!',
        } 
      },
      { 
        element: '#Preperation-details', 
        popover: { 
          title: 'Preperation details', 
          description: 'This is a list of preperation details listed by a host that describe the best way to get ready for an event',
        } 
      },
      { 
        element: '#Agenda-details', 
        popover: { 
          title: 'Agenda details', 
          description: 'This will tell you the general proceedings of an event before you attend it',
        } 
      },
      { 
        element: '#map', 
        popover: { 
          title: 'Map', 
          description: 'This will show you the approximate location of the event on a live map',
        } 
      },
      { 
        element: '#open-map', 
        popover: { 
          title: 'Open in maps', 
          description: 'If you need directions, or want to find out more about a location, selecting this will open the location in a navigation app',
        } 
      },
    ],
    
  });



  startTour() {
    this.eventdriverObj.drive();
  }

}