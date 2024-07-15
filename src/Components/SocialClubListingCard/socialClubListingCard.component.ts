import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-social-club-listing-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './socialClubListingCard.component.html',
  styleUrl: './socialClubListingCard.component.css',
})
export class SocialClubListingCardComponent {}
