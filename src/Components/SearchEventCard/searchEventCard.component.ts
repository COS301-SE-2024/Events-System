import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from 'src/Components/SearchTag/tag.component';

@Component({
  selector: 'app-search-event-card',
  standalone: true,
  imports: [CommonModule, TagComponent],
  templateUrl: './searchEventCard.component.html',
  styleUrl: './searchEventCard.component.css',
})
export class SearchEventCardComponent {}
