import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeriescentercardComponent } from 'src/Components/seriescentercard/seriescentercard.component';
import { ActivatedRoute } from '@angular/router';
import { seriesCenterTourService } from './seriesCenterTour.service';
@Component({
  selector: 'app-series-center',
  standalone: true,
  imports: [CommonModule, SeriesCenterComponent, SeriescentercardComponent],
  templateUrl: './seriesCenter.component.html',
  styleUrl: './seriesCenter.component.css',
})
export class SeriesCenterComponent implements OnInit {
  isLoading = true;
  
  socialClubs: any[] = [];
  eventSeries: any[] = [];
  filteredEvents: any[] = [];
  searchTerm = '';
  constructor(private route: ActivatedRoute, private seriesCenterTour: seriesCenterTourService){}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['startTour'] === 'true') {
        if (!sessionStorage.getItem('tourReloaded')) {
          sessionStorage.setItem('tourReloaded', 'true');
          window.location.reload();
        } else {
          sessionStorage.removeItem('tourReloaded');
          this.startTour();
          // Remove 'startTour' from query params
          const url = new URL(window.location.href);
          url.searchParams.delete('startTour');
          window.history.replaceState({}, '', url.toString());
        }
      }
    });
  
    // Fetch event series
    fetch('https://events-system-back.wn.r.appspot.com/api/eventseries')
      .then(response => response.json())
      .then(data => {
        this.eventSeries = Array.isArray(data) ? data : [data];
        sessionStorage.setItem('firstseriesID', this.eventSeries[0].seriesId);
  
        this.filteredEvents = this.eventSeries; // Initialize filteredEvents
      })
      .catch(error => {
        console.error('Error fetching event series:', error);
      })
      .finally(() => {
        this.isLoading = false; // Set isLoading to false after everything loads
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

  startTour(){
    this.seriesCenterTour.startTour();
  }
}
