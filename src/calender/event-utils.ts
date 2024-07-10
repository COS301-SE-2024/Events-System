import { EventInput } from '@fullcalendar/core';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: TODAY_STR,
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T00:00:00',
    end: TODAY_STR + 'T03:00:00',

  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T12:00:00',
    end: TODAY_STR + 'T15:00:00'
  },
  {
    id: createEventId(),
    title: 'Overflow event',
    start: '2024-07-06T20:00:00',
    end: '2024-07-07T20:00:00'
  },
  {
    id: createEventId(),
    title: 'Timed event',
      start: '2024-07-12T14:30:00',
      end: '2024-07-12T20:00:00'
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: '2024-07-22T14:30:00',
    end: '2024-07-22T20:00:00'
  }
];

export function createEventId() {
  return String(eventGuid++);
}