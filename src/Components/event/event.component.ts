import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomImageServiceService } from '../../app/random-image-service.service'; 
@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent implements OnInit{
  imageSource: string;
    // Inject RandomImageService into the constructor
    constructor(private randomImageService: RandomImageServiceService) {
      this.imageSource = '';
    }

    ngOnInit(): void {
      // Use the injected service
      this.imageSource = this.randomImageService.getRandomImageSource();
    }
  
  @Input() eventTitle: string | undefined;
  @Input() description: string | undefined;
  @Input() startTime: string | undefined;
  @Input() endTime: string | undefined;
  @Input() startDate: string | undefined;
  @Input() endDate: string | undefined;
  @Input() location: string | undefined;
  @Input() hostedBy: string | undefined;
  @Input() socialClub: string | undefined;
}

