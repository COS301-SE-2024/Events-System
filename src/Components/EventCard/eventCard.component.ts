
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RandomImageServiceService } from '../../app/random-image-service.service'; 
@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './eventCard.component.html',
  styleUrl: './eventCard.component.css',
})
export class EventCardComponent implements OnChanges, OnInit{
  imageSource: string;


  // Inject RandomImageService into the constructor
  constructor(private randomImageService: RandomImageServiceService) {
    this.imageSource = '';
  }

  @Input() eventID: string | undefined;
  @Input() eventTitle: string | undefined;
  @Input() description: string | undefined;
  @Input() startTime: string | undefined;
  @Input() endTime: string | undefined;
  @Input() startDate: string | undefined;
  @Input() endDate: string | undefined;
  @Input() location: string | undefined;
  @Input() hostedBy: string | undefined;
  @Input() socialClub: string | undefined;

  formatTime(time: string | undefined): string | undefined {
    if (time) {
      const parts = time.split(':');
      return parts[0] + ':' + parts[1];
    }
    return undefined;
  }

  isSameDate(): boolean {
    return this.startDate !== this.endDate;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startTime']) {
      this.startTime = this.formatTime(this.startTime);
    }
    if (changes['endTime']) {
      this.endTime = this.formatTime(this.endTime);
    }
  }
  ngOnInit(): void {
    // Use the injected service
    this.imageSource = this.randomImageService.getRandomImageSource();
  }


}
