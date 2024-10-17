import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SocialClubCardComponent} from 'src/Components/SocialClubCard/socialClubCard.component';
import { SocialClubCardSkeletonComponent } from 'src/Components/SocialClubCardSkeleton/SocialClubCardSkeleton.component';
import { SocialClubsTourService } from './SocialClubsTour.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-social-clubs',
  standalone: true,
  imports: [CommonModule, SocialClubCardComponent, SocialClubCardSkeletonComponent],
  templateUrl: './SocialClubs.component.html',
  styleUrl: './SocialClubs.component.css',
})
export class SocialClubsComponent implements OnInit{
  constructor(private socialclubtour: SocialClubsTourService, private route: ActivatedRoute){}
  socialclubs: any[] = [];
  filteredSocialClubs = this.socialclubs;
  searchTerm = '';
  isApiLoading = true;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['startTour'] === 'true') {
        if (!sessionStorage.getItem('tourReloaded')) {
          sessionStorage.setItem('tourReloaded', 'true');
          window.location.reload();
        } else {
          sessionStorage.removeItem('tourReloaded');
          this.startTour();
                    // Remove 'startTour' from query params
        const url = new URL(window.location.href);
        url.searchParams.delete('startTour');
        window.history.replaceState({}, '', url.toString());
        
        }
      }
    });
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
            });
        });
        return Promise.all(hostFetches); // Wait for all hostFetches to complete
      })
      .then(() => {
        sessionStorage.setItem('firstSocialclubID', this.socialclubs[0].id);

        this.filteredSocialClubs = [...this.socialclubs]; // Initialize filteredSocialClubs after all fetch requests are completed
        this.filterClubs(); // Call filterClubs after all fetch requests are completed
        this.isApiLoading = false;
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

  startTour(){
    this.socialclubtour.startTour();
  }

}
