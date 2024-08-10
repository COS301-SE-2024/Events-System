import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RandomImageServiceService } from 'src/app/random-image-service.service';

@Component({
  selector: 'app-social-club-listing-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './socialClubListingCard.component.html',
  styleUrl: './socialClubListingCard.component.css',
})
export class SocialClubListingCardComponent implements OnInit {
  @Input() clubID: string | undefined;
  @Input() clubName: string | undefined;
  @Input() description: string | undefined;
  @Input() pictureLink: string | undefined;
  @Input() summary: string | undefined;
  @Input() categories: string[] | undefined;

  imageSource: string;

  constructor(private randomImageService: RandomImageServiceService) {
    this.imageSource = '';
  }

  ngOnInit(): void {
    this.imageSource = this.randomImageService.getRandomImageSource();
  }

  // clubID: '',
  // clubName: '',
  // description: '',
  // pictureLink: '',
  // summary: '',
  // categories: []
}
