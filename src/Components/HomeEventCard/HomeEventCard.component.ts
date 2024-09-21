import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RandomImageServiceService } from '../../app/random-image-service.service'; 
import { TagComponent } from '../SearchTag/tag.component';
@Component({
  selector: 'app-home-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TagComponent],
  templateUrl: './HomeEventCard.component.html',
  styleUrl: './HomeEventCard.component.css',
})
export class HomeEventCardComponent implements OnInit{
  imageSource: string;


  // Inject RandomImageService into the constructor
  constructor(private randomImageService: RandomImageServiceService) {
    this.imageSource = '';
  }

  @Input() eventTitle: string | undefined;
  @Input() hostName: string | undefined;
  @Input() hostEmail: string | undefined;
  @Input() startTime: string | undefined;
  @Input() endTime: string | undefined;
  @Input() startDate: string | undefined;
  @Input() endDate: string | undefined;
  @Input() hostedBy: string | undefined;
  @Input() eventID: string | undefined;
  @Input() tags: any | undefined;
  get formattedStartTime() {
    return this.startTime?.slice(0, -3);
  }

  get formattedEndTime() {
    return this.endTime?.slice(0, -3);
  }
  ngOnInit(): void {
    // Use the injected service
    this.imageSource = this.randomImageService.getRandomImageSource();
  }
  // getFirstThreeTags(): string[] {
  //   return this.tags.slice(0, 3);
  // }
}
