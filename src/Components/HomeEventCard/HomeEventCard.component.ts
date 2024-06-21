import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './HomeEventCard.component.html',
  styleUrl: './HomeEventCard.component.css',
})
export class HomeEventCardComponent {
  @Input() eventTitle: string | undefined;
  @Input() hostName: string | undefined;
  @Input() hostEmail: string | undefined;
  @Input() startTime: string | undefined;
  @Input() endTime: string | undefined;
  @Input() startDate: string | undefined;
  @Input() endDate: string | undefined;
  @Input() hostedBy: string | undefined;
  
  get formattedStartTime() {
    return this.startTime?.slice(0, -3);
  }

  get formattedEndTime() {
    return this.endTime?.slice(0, -3);
  }
}
