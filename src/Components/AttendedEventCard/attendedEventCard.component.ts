import { Component } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-attended-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './attendedEventCard.component.html',
  styleUrl: './attendedEventCard.component.css',
})
export class AttendedEventCardComponent {}
