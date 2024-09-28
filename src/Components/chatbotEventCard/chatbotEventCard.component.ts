import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RandomImageServiceService } from 'src/app/random-image-service.service';
@Component({
  selector: 'app-chatbot-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chatbotEventCard.component.html',
  styleUrls: ['./chatbotEventCard.component.css'],
})
export class ChatbotEventCardComponent implements OnInit{
  @Input() title!: string;
  @Input() description!: string;
  @Input() location!: string;
  @Input() startDate!: string;
  @Input() startTime!: string;
  @Input() eventId!: number;
  imageSource = '';
  constructor(private randomImageService: RandomImageServiceService) {
    this.imageSource = '';
  }
  ngOnInit(): void {
    this.imageSource = this.randomImageService.getRandomImageSource();
  }
  formatTime(time: string | undefined): string | undefined {
    if (time) {
      const parts = time.split(':');
      return parts[0] + ':' + parts[1];
    }
    return undefined;
  }
}