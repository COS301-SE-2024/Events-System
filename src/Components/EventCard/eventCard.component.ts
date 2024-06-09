import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventCard.component.html',
  styleUrl: './eventCard.component.css',
})
export class EventCardComponent {
  eventTitle: string | undefined;
  hostName: string | undefined;
  hostEmail: string | undefined;
  startTime: string | undefined;
  endTime: string | undefined;
}
