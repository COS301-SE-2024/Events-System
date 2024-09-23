import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Leaderboard.component.html',
  styleUrl: './Leaderboard.component.css',
  animations: [
    trigger('chevronAnimation', [
      state('down', style({
        transform: 'rotate(0deg)'
      })),
      state('up', style({
        transform: 'rotate(180deg)'
      })),
      transition('down <=> up', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class LeaderboardComponent implements OnInit {
  activeTab = 1; // Default to Tab 1
  users: any[] = [];
  hostUsers: any[] = []; // Array for "Events hosted" tab
  attendUsers: any[] = []; // Array for "Events attended" tab
  paginatedUsers: any[] = [];
  events: any[] = [];
  rsvps: any[] = [];
  eventHostsortdesc = true; // Initialize with a default value
  eventAttendsortdesc = true; // Initialize with a default value
  diffHostsortdesc = true; // Initialize with a default value
  diffAttendsortdesc = true; // Initialize with a default value
  chevronHostState = 'down'; // Initialize chevron state
  chevronHostDiffState = 'down'; // Initialize chevron state
  chevronAttendState = 'down'; // Initialize chevron state
  chevronAttendDiffState = 'down'; // Initialize chevron state
  attendsorted = false;
  hostsorted = false;
  rowsPerPageOptions = [5, 10, 15, 20];
  rowsPerPage = this.rowsPerPageOptions[0];
  currentPage = 1;
  totalPages = 1;
  isLoading = true; // Add isLoading flag

  ngOnInit() {
    this.fetchData();
  }

  selectTab(tabIndex: number) {
    this.activeTab = tabIndex;
    if (tabIndex === 1) {
      this.paginatedUsers = this.hostUsers.slice((this.currentPage - 1) * this.rowsPerPage, this.currentPage * this.rowsPerPage);
    } else if (tabIndex === 2) {
      this.paginatedUsers = this.attendUsers.slice((this.currentPage - 1) * this.rowsPerPage, this.currentPage * this.rowsPerPage);
    }
    this.updatePagination();
  }

  getTabPosition(): string {
    switch (this.activeTab) {
      case 1:
        return '0%';
      case 2:
        return '50%';
      default:
        return '0%';
    }
  }

  async fetchData() {
    try {
      await Promise.all([this.fetchEmployees(), this.fetchEvents(), this.fetchRSVPs()]);
      this.calculateEventRSVPs();
      this.calculateEventHosting();
      this.updatePagination();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async fetchEmployees() {
    try {
      const response = await fetch('https://events-system-back.wn.r.appspot.com/api/employees');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.users = await response.json();
      console.log('Employees:', this.users);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  async fetchEvents() {
    try {
      const response = await fetch('https://events-system-back.wn.r.appspot.com/api/events', {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      this.events = text ? JSON.parse(text) : [];
      console.log('Events:', this.events);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  async fetchRSVPs() {
    try {
      const response = await fetch('https://events-system-back.wn.r.appspot.com/api/event-rsvps', {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.rsvps = await response.json();
      console.log('RSVPs:', this.rsvps);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  calculateEventHosting() {
    const hostingCount: { [key: number]: number } = {};

    this.events.forEach(event => {
      if (hostingCount[event.hostId]) {
        hostingCount[event.hostId]++;
      } else {
        hostingCount[event.hostId] = 1;
      }
    });

    console.log('Hosting Count:', hostingCount);

    // Filter out users who aren't hosts (i.e., user.role !== 'MANAGER')
    this.hostUsers = this.users.filter(user => user.role === 'MANAGER');

    this.hostUsers.forEach(user => {
      user.eventsHosted = hostingCount[user.employeeId] || 0;
    });

    // Sort users by eventsHosted in descending order by default
    this.hostUsers.sort((a, b) => b.eventsHosted - a.eventsHosted);

    const topEventsHosted = this.hostUsers.length > 0 ? this.hostUsers[0].eventsHosted : 0;
    console.log('Top Events Hosted:', topEventsHosted);
    this.hostUsers.forEach(user => {
      user.Hostdiff = topEventsHosted - user.eventsHosted;
      console.log('User:', user.firstName, 'User.diff:', user.Hostdiff, 'Top Events Hosted:', topEventsHosted, 'User.eventsHosted:', user.eventsHosted);
    });

    console.log('Host Users:', this.hostUsers);
  }

  calculateEventRSVPs() {
    const rsvpCount: { [key: number]: number } = {};

    this.rsvps.forEach(rsvp => {
      if (rsvp.status === 'attending') {
        if (rsvpCount[rsvp.employeeId]) {
          rsvpCount[rsvp.employeeId]++;
        } else {
          rsvpCount[rsvp.employeeId] = 1;
        }
      }
    });

    console.log('RSVP Count:', rsvpCount);

    this.attendUsers = [...this.users]; // Copy the users array

    this.attendUsers.forEach(user => {
      user.eventsAttended = rsvpCount[user.employeeId] || 0;
    });

    // Sort users by eventsAttended in descending order by default
    this.attendUsers.sort((a, b) => b.eventsAttended - a.eventsAttended);

    const topEventsAttended = this.attendUsers.length > 0 ? this.attendUsers[0].eventsAttended : 0;
    console.log('Top Events Attended:', topEventsAttended);
    this.attendUsers.forEach(user => {
      user.Attenddiff = topEventsAttended - user.eventsAttended;
    });

    console.log('Attend Users:', this.attendUsers);
  }

  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName ? firstName.charAt(0) : '';
    const lastInitial = lastName ? lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  sortEventsHosted() {
    this.eventHostsortdesc = !this.eventHostsortdesc; // Toggle the sorting order
    this.chevronHostState = this.eventHostsortdesc ? 'down' : 'up'; // Update chevron state
    if (this.eventHostsortdesc) {
      this.hostUsers.sort((a, b) => b.eventsHosted - a.eventsHosted);
    } else {
      this.hostUsers.sort((a, b) => a.eventsHosted - b.eventsHosted);
    }
    this.updatePagination();
  }

  sortEventsAttended() {
    this.eventAttendsortdesc = !this.eventAttendsortdesc; // Toggle the sorting order
    this.chevronAttendState = this.eventAttendsortdesc ? 'down' : 'up'; // Update chevron state
    if (this.eventAttendsortdesc) {
      this.attendUsers.sort((a, b) => b.eventsAttended - a.eventsAttended);
    } else {
      this.attendUsers.sort((a, b) => a.eventsAttended - b.eventsAttended);
    }
    this.updatePagination();
  }

  sortEventHostDiff() {
    this.diffHostsortdesc = !this.diffHostsortdesc; // Toggle the sorting order
    this.chevronHostDiffState = this.diffHostsortdesc ? 'down' : 'up'; // Update chevron state
    if (this.diffHostsortdesc) {
      this.hostUsers.sort((a, b) => b.Hostdiff - a.Hostdiff);
    } else {
      this.hostUsers.sort((a, b) => a.Hostdiff - b.Hostdiff);
    }
    this.updatePagination();
  }

  sortEventAttendDiff() {
    this.diffAttendsortdesc = !this.diffAttendsortdesc; // Toggle the sorting order
    this.chevronAttendDiffState = this.diffAttendsortdesc ? 'down' : 'up'; // Update chevron state
    if (this.diffAttendsortdesc) {
      this.attendUsers.sort((a, b) => b.Attenddiff - a.Attenddiff);
    } else {
      this.attendUsers.sort((a, b) => a.Attenddiff - b.Attenddiff);
    }
    this.updatePagination();
  }

  updatePagination() {
    if (this.activeTab === 1) {
      this.totalPages = Math.ceil(this.hostUsers.length / this.rowsPerPage);
      this.paginatedUsers = this.hostUsers.slice((this.currentPage - 1) * this.rowsPerPage, this.currentPage * this.rowsPerPage);
    } else if (this.activeTab === 2) {
      this.totalPages = Math.ceil(this.attendUsers.length / this.rowsPerPage);
      this.paginatedUsers = this.attendUsers.slice((this.currentPage - 1) * this.rowsPerPage, this.currentPage * this.rowsPerPage);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
}