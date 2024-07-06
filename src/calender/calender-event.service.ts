import { Injectable } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { EventSourceInput } from '@fullcalendar/core';
let eventGuid = 0;

@Injectable({
  providedIn: 'root'
})
export class CalenderEventsService {
    
  async fetchAndFormatEvents(): Promise<EventSourceInput> { // Step 3: Adjust the return type
    try {
      const response = await fetch('https://events-system-back.wn.r.appspot.com/api/events');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const events = await response.json();

      // Transform the events to match the EventInput format
      const transformedEvents: EventInput[] = events.map((event: any) => ({ // Step 1 & 2: Define and use the proper event type
        id: event.eventId,
        title: event.title,
        start: event.startDate + (event.startTime ? `T${event.startTime}` : ''),
        end: event.endDate + (event.endTime ? `T${event.endTime}` : ''),
        // Add other properties as needed
      }));
  
      console.log('Transformed Events:', transformedEvents); // Log the transformed events
  
      return transformedEvents;
    } catch (error) {
      console.error('There was a problem fetching the events:', error);
      return []; // Return an empty array in case of error
    }
  }
  
}
export function createEventId() {
    return String(eventGuid++);
}