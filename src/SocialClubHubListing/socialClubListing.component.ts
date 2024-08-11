import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SocialClubListingCardComponent } from 'src/Components/SocialClubListingCard/socialClubListingCard.component';
import {GhostSocialClubCardComponent} from 'src/Components/GhostSocialClubCard/GhostSocialClubCard.component';
import { SocialClubComponent } from 'src/socialClub/socialClub.component';

// Define an interface for the cache
interface Cache {
  socialClubs?: any[];
}

@Component({
  selector: 'app-social-club-listing',
  standalone: true,
  imports: [CommonModule, RouterModule, SocialClubListingCardComponent, GhostSocialClubCardComponent],
  templateUrl: './socialClubListing.component.html',
  styleUrl: './socialClubListing.component.css',
})
export class SocialClubListingComponent implements OnInit {
  clubs: any[] = [];
  isLoading = true;
  club = {
    clubID: '',
    clubName: '',
    description: '',
    pictureLink: '',
    summary: '',
    categories: []
  };

  ngOnInit(): void {
      fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs')
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.clubs = Array.isArray(data) ? data : [data];
        
        for(let i = 0; i < this.clubs.length; ++i) {
          if(!this.clubs[i].pictureLink || this.clubs[i].pictureLink == '') {
            this.clubs[i].pictureLink = "assets/pexels-rahulp9800-1652361.jpg";
          }
        }
      })
      .then(() => {
        this.isLoading = false;
      })
  }
}
