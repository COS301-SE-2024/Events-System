import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-host-checkin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './host-checkin.component.html',
  styleUrls: ['./host-checkin.component.css'],
})
export class HostCheckinComponent implements OnInit {
  rsvpedEmployees: Array<{
    id: number; 
    name: string;
    surname: string;
    email: string;
    status: string;
    lastUpdated: Date;
    showDetails?: boolean;
  }> = [];
  isDesktop = true;
  eventId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.updateViewMode();
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventId');
      console.log(this.eventId);  // Log the eventId to the console
    }); 
    
    this.rsvpedEmployees = [
      {
        id: 1,
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        status: 'RSVPd',
        lastUpdated: new Date('2024-08-07T10:00:00'),
      },
      {
        id: 2,
        name: 'Jane',
        surname: 'Smith',
        email: 'jane.smith@example.com',
        status: 'Checked-in',
        lastUpdated: new Date('2024-08-06T15:30:00'),
      },
      {
        id: 3,
        name: 'Alice',
        surname: 'Johnson',
        email: 'alice.johnson@example.com',
        status: 'Canceled',
        lastUpdated: new Date('2024-08-05T09:00:00'),
      },
    ];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateViewMode();
  }

  updateViewMode(): void {
    this.isDesktop = window.innerWidth >= 768;
  }

  toggleDetails(index: number): void {
    this.rsvpedEmployees[index].showDetails = !this.rsvpedEmployees[index].showDetails;
  }

  removeEmployee(index: number): void {
    this.rsvpedEmployees.splice(index, 1);
  }
}
