import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SocialClubCardComponent} from 'src/Components/SocialClubCard/socialClubCard.component';

@Component({
  selector: 'app-social-clubs',
  standalone: true,
  imports: [CommonModule, SocialClubCardComponent],
  templateUrl: './SocialClubs.component.html',
  styleUrl: './SocialClubs.component.css',
})
export class SocialClubsComponent implements OnInit{
  socialclubs: any[] = [];
  filteredSocialClubs = this.socialclubs;
  searchTerm = '';
  ngOnInit(): void {
    fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs')
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.socialclubs = Array.isArray(data) ? data : [data];
        const hostFetches = this.socialclubs.map(club => {
          return fetch('https://events-system-back.wn.r.appspot.com/api/employees/' + club.ownerID)
            .then(response => {
              return response.json();
            })
            .then(data => {
              club.host = data.firstName + " "+  data.lastName; // Add host data to the event
              console.log(club);
            });
        });
        return Promise.all(hostFetches); // Wait for all hostFetches to complete
      })
      .then(() => {
        this.filteredSocialClubs = [...this.socialclubs]; // Initialize filteredSocialClubs after all fetch requests are completed
        this.filterClubs(); // Call filterClubs after all fetch requests are completed
      });
  }

  filterClubs() {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredSocialClubs = this.socialclubs.filter(club => 
      club.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      club.host.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  updateSearchTerm(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target?.value || '';
    this.filterClubs();
  }

  filterByTitle() {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredSocialClubs = this.socialclubs.filter(club => 
      club.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      club.host.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }
}
