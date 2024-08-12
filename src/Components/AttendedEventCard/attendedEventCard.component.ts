import { Component, Input, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';
import { RandomImageServiceService } from 'src/app/random-image-service.service';
@Component({
  selector: 'app-attended-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './attendedEventCard.component.html',
  styleUrl: './attendedEventCard.component.css',
})
export class AttendedEventCardComponent implements OnInit{
  imageSource= "";

  constructor(private randomImageService: RandomImageServiceService) {
    this.imageSource = '';
  }
  ngOnInit(): void {
    // Use the injected service
    this.imageSource = this.randomImageService.getRandomImageSource();
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

}
