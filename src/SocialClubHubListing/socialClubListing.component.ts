import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialClubListingCardComponent } from 'src/Components/SocialClubListingCard/socialClubListingCard.component';

@Component({
  selector: 'app-social-club-listing',
  standalone: true,
  imports: [CommonModule, SocialClubListingCardComponent],
  templateUrl: './socialClubListing.component.html',
  styleUrl: './socialClubListing.component.css',
})
export class SocialClubListingComponent {}
