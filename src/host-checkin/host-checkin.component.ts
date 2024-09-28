import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-host-checkin',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
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
    rsvpId: number;
  }> = [];
  isDesktop = true;
  eventId: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.updateViewMode();
    this.route.paramMap.subscribe(params => {
      this.eventId = params.get('eventId');
      //console.log(this.eventId);  // Log the eventId to the console
      if (this.eventId) {
        this.fetchRsvpedEmployees(this.eventId);
      }
    }); 
  }

  fetchRsvpedEmployees(eventId: string): void {
    const url = `https://events-system-back.wn.r.appspot.com/api/events/${eventId}/rsvps`;
    //console.log(url); // Log the URL for debugging
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.rsvpedEmployees = data.map(item => ({
          id: item.employee.employeeId,
          name: item.employee.firstName,
          surname: item.employee.lastName,
          email: item.employee.email,
          status: item.rsvp.status,
          lastUpdated: new Date(item.employee.updatedAt),
          showDetails: false,
          rsvpId: item.rsvp.rsvpId
        })); 
        //console.log(this.rsvpedEmployees); // Log the data for debugging
      },
      (error) => {
        console.error('Error fetching rsvped employees:', error);
      }
    );
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
    console.log(this.rsvpedEmployees);
    const eventRSVPId = this.rsvpedEmployees[index].rsvpId;

    //send an http delete request to the server
    //the endpoint is https://events-system-back.wn.r.appspot.com/api/event-rsvps/${eventRSVPId}

    const url = `https://events-system-back.wn.r.appspot.com/api/event-rsvps/${eventRSVPId}`;

    this.http.delete<any>(url).subscribe(
      (data) => {
        console.log(data);
        this.rsvpedEmployees.splice(index, 1);
      },
      (error) => {
        console.error('Error deleting rsvped employee:', error);
      }
    );
  }
}
