import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RandomHeaderService } from '../app/random-header.service';
import { EventCardComponent } from 'src/Components/EventCard/eventCard.component';
import { GhostEventCardComponent } from 'src/Components/GhostEventCard/GhostEventCard.component';

@Component({
  selector: 'app-social-club',
  standalone: true,
  imports: [CommonModule, RouterModule, EventCardComponent, GhostEventCardComponent],
  templateUrl: './socialClub.component.html',
  styleUrl: './socialClub.component.css',
})
export class SocialClubComponent implements OnInit {
  imageSource: string;
  isLoading = true;
  clubId = '';
  club: any = null;
  events: any[] = [];
  activeTab = 'tab1';
  ownerName = '';
  ownerSurname = '';

  goBack(): void {
    window.history.back();
  }

  constructor(private route: ActivatedRoute, private randomHeaderService: RandomHeaderService) {
    this.imageSource = '';
  }

  ngOnInit(): void {
    this.imageSource = this.randomHeaderService.getRandomHeaderSource();
    this.route.params.subscribe(params => {
      this.clubId = params['id'];

      const fetchClub = fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + this.clubId)
        .then(response => response.json())
        .then(data => {
          this.club = data;

          // Fetch owner details using ownerID
          return fetch('https://events-system-back.wn.r.appspot.com/api/employees/' + this.club.ownerID)
            .then(response => response.json())
            .then(ownerData => {
              this.ownerName = ownerData.firstName;
              this.ownerSurname = ownerData.lastName;
            });
        });

      const fetchEvents = fetch('https://events-system-back.wn.r.appspot.com/api/events')
        .then(response => response.json())
        .then(data => {
          this.events = data.filter((event: any) => event.socialClub === parseInt(this.clubId, 10));
          const hostFetches = this.events.map(event => {
            return fetch('https://events-system-back.wn.r.appspot.com/api/employees/' + event.hostId)
              .then(response => {
                if (response.ok) {
                  // throw new Error(`HTTP error! status: ${response.status}`);
                  return response.json(); // Parse the response as JSON
                }
                else {
                  window.location.reload();
                  return null;
                }
              })
              .then(data => {
                event.host = data; // Add host data to the event
              })
              .catch(() => {
                window.location.reload();
              });
          });
          return Promise.all(hostFetches);
        });

      Promise.all([fetchClub, fetchEvents])
        .then(() => {
          this.isLoading = false;
        })
        .catch(error => {
          this.isLoading = false; // Set isLoading to false even if there is an error
        });
    });
  }
}