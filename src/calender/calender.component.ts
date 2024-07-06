import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalenderEventButtonComponent} from "src/Components/Calender-Event-Button/Calender-Event-button.component";
import dayGridPlugin from '@fullcalendar/daygrid';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [CommonModule, CalenderEventButtonComponent, FullCalendarModule],
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
})
export class CalenderComponent {
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],

    headerToolbar: {
      left: 'title',
      center: '',
      right: 'prev,today,next dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    fixedWeekCount: false,
    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      meridiem: 'short'
    },
    eventOrder: "Title, start",
    showNonCurrentDates: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),

    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(private changeDetector: ChangeDetectorRef) {
    this.updateCalendarOptions(); // Set initial options based on current viewport size
  
    // Listen for window resize events to adjust calendar options
    window.addEventListener('resize', () => this.updateCalendarOptions());
  }
  
  ngOnDestroy() {
    // Clean up the event listener when the component is destroyed
    window.removeEventListener('resize', () => this.updateCalendarOptions());
  }
  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    // const title = prompt('Please enter a new title for your event');
    // const calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect(); // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   });
    // }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }
  updateCalendarOptions() {
    this.calendarOptions.update(options => {
      if (window.innerWidth < 768) { // Assuming 768px is the breakpoint for mobile devices
        return {
          ...options,
          headerToolbar: {
            left: 'title',
            center: '',
            right: 'prev,next'
          },
          // initialView: 'dayGridMonth',
          initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
          weekends: true,
          editable: true,
          selectable: true,
          selectMirror: true,
          showNonCurrentDates: true,
          dayMaxEvents: true,
          fixedWeekCount: false,
          
          select: this.handleDateSelect.bind(this),
          eventClick: this.handleEventClick.bind(this),
          eventsSet: this.handleEvents.bind(this)
        };

      } else {
        return {
          ...options,
          headerToolbar: {
            left: 'title',
            center: '',
            right: 'prev,today,next dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          },
          // initialView: 'dayGridMonth',
          initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
          weekends: true,
          editable: true,
          selectable: true,
          selectMirror: true,
          dayMaxEvents: true,
          showNonCurrentDates: true,
          fixedWeekCount: false,
          contentHeight: window.innerHeight-150,
          select: this.handleDateSelect.bind(this),
          eventClick: this.handleEventClick.bind(this),
          eventsSet: this.handleEvents.bind(this)
          // Add any other desktop-specific options here
        };
      }
    });
  }
}
