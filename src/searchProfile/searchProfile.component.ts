import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {AttendedEventCardComponent} from 'src/Components/AttendedEventCard/attendedEventCard.component'

@Component({
  selector: 'app-search-profile',
  standalone: true,
  imports: [CommonModule, AttendedEventCardComponent],
  templateUrl: './searchProfile.component.html',
  styleUrl: './searchProfile.component.css',
})
export class SearchProfileComponent implements OnInit {
  selectedTab = 'about';
  employeeData: any; // Define employeeData property
  events: any[] = [];
  constructor(private route: ActivatedRoute) {}
  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  goBack(): void {
    window.history.back();
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
    const storedEmployeeData1 = params['id'];
    const employeeID = storedEmployeeData1;
    fetch(`https://events-system-back.wn.r.appspot.com/api/employees/${storedEmployeeData1}`)
    .then(response => response.json())
    .then(data => {
      this.employeeData = data;
    })
    .catch(error => {
      console.error('Error fetching employee data:', error);
    });

    fetch(`https://events-system-back.wn.r.appspot.com/api/events/employee/${employeeID}/events-attended`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      this.events = data;
      console.log(this.events);
      // return Array.isArray(data) ? data : [data];
    })
    .catch(error => {
      console.error('Error fetching attended events:', error);
      return [];
    });
  })
  this.logUserAnalytics('viewed_profile: ' + this.employeeData.id);

}

    getInitials(): string {
      const firstInitial = this.employeeData.firstName ? this.employeeData.firstName.charAt(0) : '';
      const lastInitial = this.employeeData.lastName ? this.employeeData.lastName.charAt(0) : '';
      return `${firstInitial}${lastInitial}`.toUpperCase();
    }
    async logUserAnalytics(action: string): Promise<void> {
      const userId = localStorage.getItem('ID');
      if (!userId) return;
    
      const requestBody = {
        userId: parseInt(userId),
        actionType: action
      };
    
      try {
        const response = await fetch('https://events-system-back.wn.r.appspot.com/api/user-analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
    
        if (!response.ok) {
          throw new Error('Failed to log user analytics');
        }
    
        console.log('User analytics logged successfully');
      } catch (error) {
        console.error('Error logging user analytics:', error);
      }
    }
}
