import { Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RandomImageServiceService } from '../../app/random-image-service.service'; 
import { RandomHeaderService } from 'src/app/random-header.service';
@Component({
  selector: 'app-social-club-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './socialClubCard.component.html',
  styleUrl: './socialClubCard.component.css',
})
export class SocialClubCardComponent implements OnInit{

  imageSource: string;
  // Inject RandomImageService into the constructor
  constructor(private randomheaderService: RandomHeaderService) {
    this.imageSource = '';
  }

  ngOnInit(): void {
    // Use the injected service
    this.imageSource = this.randomheaderService.getRandomHeaderSource();
  }

  @Input() socialClubName: string | undefined;
  @Input() socialClubCreator: string | undefined;
  @Input() socialClubID: string | undefined;
  @Input() socialClubDescription: string | undefined;
}
