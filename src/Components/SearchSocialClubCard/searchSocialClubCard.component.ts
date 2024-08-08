import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomHeaderService } from '../../app/random-header.service'; 
@Component({
  selector: 'app-search-social-club-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './searchSocialClubCard.component.html',
  styleUrl: './searchSocialClubCard.component.css',
})
export class SearchSocialClubCardComponent {
  @Input() clubID: string | undefined;
  @Input() clubName: string | undefined;
  @Input() clubSummary: string | undefined;
  @Input() clubDescription: string | undefined;
  imageSource: string;
  constructor(private randomHeaderService: RandomHeaderService) { 
    this.imageSource = '';
  }

  ngOnInit(): void {
    this.imageSource = this.randomHeaderService.getRandomHeaderSource();
  }
}
