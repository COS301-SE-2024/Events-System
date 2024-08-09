import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeriescentercardComponent } from 'src/Components/seriescentercard/seriescentercard.component';

@Component({
  selector: 'app-series-center',
  standalone: true,
  imports: [CommonModule, SeriesCenterComponent, SeriescentercardComponent],
  templateUrl: './seriesCenter.component.html',
  styleUrl: './seriesCenter.component.css',
})
export class SeriesCenterComponent implements OnInit {
  isLoading: any;
  socialClubs: any[] = [];
  eventSeries: any[] = [];
  filteredEvents: any[] = [];
  searchTerm = '';

  ngOnInit(): void {
    fetch('https://events-system-back.wn.r.appspot.com/api/socialClubs')
      .then(response => response.json())
      .then(data => {
        this.socialClubs = Array.isArray(data) ? data : [data];
      });

    // Fetch event series
    fetch('https://events-system-back.wn.r.appspot.com/api/eventseries')
      .then(response => response.json())
      .then(data => {
        this.eventSeries = Array.isArray(data) ? data : [data];
        this.filteredEvents = this.eventSeries; // Initialize filteredEvents
      });
  }

  updateSearchTerm(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target?.value || '';
    this.filterByTitle();
  }

  filterByTitle() {
    this.filteredEvents = this.eventSeries.filter(event => 
      event.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
