import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventCard.component.html',
  styleUrl: './eventCard.component.css',
})
export class EventCardComponent {
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
