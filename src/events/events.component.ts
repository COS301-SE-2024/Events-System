import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from 'src/Components/event/event.component';
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, EventComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent {}
