import { Injectable } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { EventSourceInput } from '@fullcalendar/core';
let eventGuid = 0;

@Injectable({
  providedIn: 'root'
})
export class CalenderEventsService {
    
    
  async fetchAndFormatEvents(selectedSocialClubs: string[] | 'all' = 'all'): Promise<EventSourceInput> {
    try {
      const response = await fetch('https://events-system-back.wn.r.appspot.com/api/events');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const events = await response.json();

      // Transform the events to match the EventInput format
      let transformedEvents: EventInput[] = events.map((event: any) => ({
        id: event.eventId,
        title: event.title,
        start: event.startDate + (event.startTime ? `T${event.startTime}` : ''),
        end: event.endDate + (event.endTime ? `T${event.endTime}` : ''),
        extendedProps: {
          location: event.location,
          socialClub: event.socialClub,
        }
      }));

if (selectedSocialClubs !== 'all') {
  console.log('Selected Social Clubs:', selectedSocialClubs); // Log the selected social clubs
  transformedEvents = transformedEvents.filter(event =>
    selectedSocialClubs.includes(event.extendedProps?.['socialClub'] ?? '')
  );
}

      // console.log('Transformed Events:', transformedEvents); // Log the transformed events
  
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