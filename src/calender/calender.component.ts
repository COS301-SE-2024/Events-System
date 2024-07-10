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
  uniqueSocialClubs: any[] = [];
  checkedSocialClubs: any[] = [];
  allClubsChecked = false;
  socialClubs: any[] = [];
  otherCheckboxes: boolean[] = [];
  events: any[] = [];
  filteredEvents: any[] = [];

  selectedDietaryAccommodation = '';
  async ngOnInit() {
      // Fetch social club information for each unique social club
      fetch('https://events-system-back.wn.r.appspot.com/api/events')
        .then(response => response.json())
        .then(async data => { // Mark this function as async
  
          this.events = Array.isArray(data) ? data : [data];
          this.uniqueSocialClubs = [...new Set(this.events.map(event => event.socialClub))];
          this.otherCheckboxes = new Array(this.uniqueSocialClubs.length).fill(false);


          // Prepare fetch requests for each unique social club
          const socialClubFetches = this.uniqueSocialClubs.map(socialClubId =>
            fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + socialClubId)
              .then(response => response.json())
          );
  
          // Wait for all social club fetches to complete
          const socialClubsData = await Promise.all(socialClubFetches);
          socialClubsData.forEach(data => {
            console.log(data);
            // Store the social club data in a property of the component
            this.socialClubs.push(data);
          });
          // Update uniqueSocialClubs and otherCheckboxes based on loaded socialClubs
          this.uniqueSocialClubs = [...new Set(this.socialClubs.map(club => club))];
          this.otherCheckboxes = new Array(this.uniqueSocialClubs.length).fill(false);
  
          // Now that all social clubs are loaded, fetch and format events
          const events = await this.calenderEventsService.fetchAndFormatEvents();
          this.calendarOptions.update(options => {
            return {
              ...options,
              events: events,
            };
          });
        });
  }
  onAllClubsClick() {
    if (this.allClubsChecked) {
      this.otherCheckboxes = this.otherCheckboxes.map(() => false);
      this.checkedSocialClubs = [];
      this.updateCalender('all');
      // this.calenderEventsService.fetchAndFormatEvents('all');

    } else {
      this.checkedSocialClubs = [...this.uniqueSocialClubs];
    }
  }
  onOtherClubClick(i: number) {
    if(this.checkedSocialClubs.length > 1){
      this.updateCalender('all');
    }
    const club = this.uniqueSocialClubs[i];
    if (this.otherCheckboxes[i]) {
      this.checkedSocialClubs.push(club);
    } else {
      const index = this.checkedSocialClubs.indexOf(club);
      if (index > -1) {
        this.checkedSocialClubs.splice(index, 1);
      }
    }
    // console.log(this.checkedSocialClubs.map(club => club['id']));
    this.updateCalender(this.checkedSocialClubs.map(club => club['id']));

    // this.calenderEventsService.fetchAndFormatEvents(this.checkedSocialClubs.map(club => club['id']));   
    // this.updateCalendarOptions();
     if (this.otherCheckboxes[i]) {
      this.allClubsChecked = false;
    }
  }

  async updateCalender(selectedSocialClubs: string[] | 'all' = 'all') {
    if (selectedSocialClubs.length === 0) {
      selectedSocialClubs = 'all';
    }
    const filteredEvents = await this.calenderEventsService.fetchAndFormatEvents(selectedSocialClubs);
    this.calendarOptions.update(options => {
      return {
        ...options,
        events: filteredEvents,
      };
    });
  }
    filterEvents1(event: any[]) {

    if (this.checkedSocialClubs.length > 0) {
      this.filteredEvents = this.events.filter(event => 
        this.checkedSocialClubs.includes(event.socialClub) 
      );
    } 
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
    // defaultAllDay: true,
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
  isSingleDayEvent(event: any): boolean {
    const startDate = new Date(event.start).toDateString();
    const endDate = new Date(event.end).toDateString();
    return startDate === endDate;
  }
  
  
  currentEvents: any[] =[];
  filterEvents: any[] =[];
  handleMoreLinkClick(info: any) {
    const clickedDate = info.date;
    this.getEventsForDate(clickedDate.toISOString());
  }
  constructor(private changeDetector: ChangeDetectorRef, private calenderEventsService: CalenderEventsService, private router: Router) {
    this.updateCalendarOptions(); // Set initial options based on current viewport size
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
    const eventsForDate = this.getEventsForDate(dateStr.dateStr);
  }

  getEventsForDate(dateStr: string) {
    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0); // Normalize the target date to start of day for comparison
    
    const uniqueEventIds = new Set(); // Set to track unique event IDs
    this.filterEvents = this.currentEvents.filter((event) => {
      const eventStartDate = new Date(event.start);
      eventStartDate.setHours(0, 0, 0, 0); // Normalize start date to start of day
      const eventEndDate = new Date(event.end);
      eventEndDate.setHours(23, 59, 59, 999); // Set end date to end of day for inclusive comparison
  
      // Check if targetDate is between event start and end dates (inclusive)
      const isDateInRange = targetDate >= eventStartDate && targetDate <= eventEndDate;
  
      // Check if the event ID is already in the set
      if (isDateInRange && !uniqueEventIds.has(event.id)) {
        uniqueEventIds.add(event.id); // Add event ID to the set
        return true;
      }
      return false;
    });
  }
  formatEventTime(startTime: string, endTime: string): string {
    const formatTime = (date: Date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutesStr = minutes < 10 ? '0'+ minutes : minutes;
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
