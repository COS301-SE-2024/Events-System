import { Component, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalenderEventButtonComponent} from "src/Components/Calender-Event-Button/Calender-Event-button.component";
import dayGridPlugin from '@fullcalendar/daygrid';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { Router, RouterModule} from '@angular/router';
import { CalenderEventsService } from './calender-event.service';
import { get } from 'http';
@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [CommonModule, CalenderEventButtonComponent, FullCalendarModule, RouterModule],
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
})
export class CalenderComponent implements OnInit{
  async ngOnInit() {
    const events = await this.calenderEventsService.fetchAndFormatEvents();
    this.calendarOptions.update(options => {
        return {
          ...options,
          events: events,
        };
    });

  }

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
    moreLinkClick: this.handleMoreLinkClick.bind(this),
    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      meridiem: 'short'
    },
    eventOrder: "Title, start",
    showNonCurrentDates: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    dateClick: this.handleDateClick.bind(this), // Ensure 'this' context is preserved
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  
  currentEvents: any[] =[];
  filterEvents: any[] =[];
  handleMoreLinkClick(info: any) {
    // Extract the date from the info object
    console.log('More link clicked info:', info);
    const clickedDate = info.date;
  
    // Log the clicked date or perform any action you need with it
    console.log('More link clicked date:', clickedDate.toISOString());
    this.getEventsForDate(clickedDate.toISOString());
    // If you need just the day part
    console.log('Day of the month:', clickedDate.getDate());
  
    // Add any additional logic you need for when a more link is clicked
  }
  constructor(private changeDetector: ChangeDetectorRef, private calenderEventsService: CalenderEventsService, private router: Router) {
    this.updateCalendarOptions(); // Set initial options based on current viewport size
  
    // Listen for window resize events to adjust calendar options
    window.addEventListener('resize', () => this.updateCalendarOptions());
  }
  
  ngOnDestroy() {
    // Clean up the event listener when the component is destroyed
    window.removeEventListener('resize', () => this.updateCalendarOptions());
  }
  handleEvents(events: any[]) {
    this.currentEvents = [...this.currentEvents, ...events];
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }  
  handleDateClick(clickInfo: any) {
    // arg.dateStr contains the clicked date in 'YYYY-MM-DD' format
    this.onDateClick(clickInfo);
  }
  

  onDateClick(dateStr: DateClickArg) {
    // Your logic to fetch and display events for the clicked date
    console.log('Date clicked: ', dateStr.dateStr);
    const eventsForDate = this.getEventsForDate(dateStr.dateStr);
    // Example: Fetch events for 'dateStr' and display them in the mobile-specific div
  }

  getEventsForDate(dateStr: string){
    console.log("current events: " + JSON.stringify(this.currentEvents));
    const targetDate = new Date(dateStr);

    this.filterEvents = this.currentEvents.filter((event) => {
        const eventStartDate = new Date(event.start);
        // Compare year, month, and day
        const isSameDate = eventStartDate.getFullYear() === targetDate.getFullYear() &&
                           eventStartDate.getMonth() === targetDate.getMonth() &&
                           eventStartDate.getDate() === targetDate.getDate();

        console.log("Event matches date: " + isSameDate + " for event: " + JSON.stringify(event));

        return isSameDate;
    });

  }
  formatEventTime(startTime: string, endTime: string): string {
    const formatTime = (date: Date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutesStr = minutes < 10 ? '0'+minutes : minutes;
      return `${hours}:${minutesStr}${ampm}`;
    };
  
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
  
    return `${formatTime(startDate)}-${formatTime(endDate)}`;
  }
  handleEventClick(clickInfo: EventClickArg) {
    clickInfo.jsEvent.preventDefault();
  this.router.navigate(['/event', clickInfo.event.id]);

  return false;
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
    console.log("date selected" + selectInfo);
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
