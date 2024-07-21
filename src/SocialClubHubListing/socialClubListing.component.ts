import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SocialClubListingCardComponent } from 'src/Components/SocialClubListingCard/socialClubListingCard.component';
import { SocialClubComponent } from 'src/socialClub/socialClub.component';

// Define an interface for the cache
interface Cache {
  socialClubs?: any[];
}

@Component({
  selector: 'app-social-club-listing',
  standalone: true,
  imports: [CommonModule, RouterModule, SocialClubListingCardComponent],
  templateUrl: './socialClubListing.component.html',
  styleUrl: './socialClubListing.component.css',
})
export class SocialClubListingComponent implements OnInit {
  clubs: any[] = [];
  club = {
    clubID: '',
    clubName: '',
    description: '',
    pictureLink: '',
    summary: '',
    categories: []
  };

  private cache: Cache = {};

  ngOnInit(): void {
      fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs')
      .then(response => {
        return response.json();
      })
      .then(data => {
        const clubs = Array.isArray(data) ? data : [data];
        localStorage.setItem('socialClubs', JSON.stringify(clubs));
        this.clubs = clubs;
        console.log(localStorage.getItem('socialClubs'));
      })
  }
}
