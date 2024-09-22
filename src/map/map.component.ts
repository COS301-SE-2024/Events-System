import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MapCardComponent } from 'src/Components/MapCard/MapCard.component';
import { RandomImageServiceService } from 'src/app/random-image-service.service';

interface CustomMarker extends L.Marker {
  eventId: number;
  socialClub: number;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, MapCardComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  constructor(private randomImageService: RandomImageServiceService) {}
  private map: L.Map | undefined;
  private markers: CustomMarker[] = [];
  private events: any[] = [];
  uniqueSocialClubs: any[] = [];
  socialClubs: any[] = [];
  allClubsChecked = false;
  allSeriesChecked = false;
  otherCheckboxes: boolean[] = [];
  otherSeriesCheckboxes: boolean[] = [];
  series: any[] = [];
  checkedSocialClubs: any[] = [];
  checkedSeries: any[] = [];
  isDrawerOpen = false;
  isFilterOpen = false;

  @ViewChild(MapCardComponent) mapCardComponent!: MapCardComponent;

  ngOnInit(): void {
    this.initMap();
    this.fetchEventsAndAddMarkers();
    this.fetchSeries();
    this.addUserLocation();
  }

  ngAfterViewInit(): void {
    const drawerToggle = document.getElementById('my-drawer-4') as HTMLInputElement;
    if (drawerToggle) {
      drawerToggle.addEventListener('change', () => {
        if (!drawerToggle.checked) {
          this.isFilterOpen = false;
        }
      });
    }
  }

  private initMap(): void {
    this.map = L.map('map').setView([-25.7552742, 28.2337029], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);

    const popup = L.popup();
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  private fetchEventsAndAddMarkers(): void {
    fetch('https://events-system-back.wn.r.appspot.com/api/events') // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((events) => {
        this.events = events; // Store events for later use in search
        console.log('Fetched events:', events);

        // Extract unique social clubs
        this.uniqueSocialClubs = [...new Set(this.events.map((event) => event.socialClub))];

        // Fetch social club information for each unique social club
        const socialClubFetches = this.uniqueSocialClubs.map((socialClubId) => {
          return fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + socialClubId)
            .then((response) => response.json())
            .then((data) => {
              // Store the social club data in a property of the component
              this.socialClubs.push(data);
              this.uniqueSocialClubs = [...new Set(this.socialClubs.map((club) => club))];
            });
        });

        // Wait for all social club fetches to complete before adding markers
        Promise.all(socialClubFetches).then(() => {
          if (this.map) {
            this.events.forEach((event: any) => {
              const geolocation = event.geolocation.split(','); // Assuming geolocation is a comma-separated string
              const lat = parseFloat(geolocation[0]);
              const lng = parseFloat(geolocation[1]);
              const isMobile = window.matchMedia('(max-width: 720px)').matches;
              console.log(isMobile);
              const marker = L.marker([lat, lng]).addTo(this.map!) as CustomMarker;
              marker.eventId = event.eventId; // Store eventId in marker
              marker.socialClub = event.socialClub; // Store socialClub in marker
              this.markers.push(marker); // Store marker for later use in search

                marker.on('click', () => this.showCard(lat, lng, `${event.title}`, `${event.description}`, `${event.eventId}`, `${event.startTime}`, `${event.endTime}`, `${event.startDate}`, `${event.endDate}`, `${event.eventPreparation}`));
              
            });
          }
        });
      })
      .catch((error) => console.error('Error fetching events:', error));
  }

  private addUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const userIcon = L.divIcon({
            html: '<i class="fas fa-map-marker-alt fa-3x" style="color: green;"></i>',
            className: 'custom-div-icon',
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            popupAnchor: [0, -38],
          });

          if (this.map) {
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            if (isMobile) {
              L.marker([lat, lng], { icon: userIcon })
                .addTo(this.map)
                .on('click', () => this.showCard(lat, lng, 'You', 'You are here!', '0', '0', '0', '0', '0', '0'));
            } else {
              L.marker([lat, lng], { icon: userIcon })
                .addTo(this.map)
                .bindPopup(this.createPopupContent(lat, lng, 'You are here!'))
                .openPopup();
            }
            // this.map.setView([lat, lng], 13); // Optionally, center the map on the user's location
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  closeDrawer(): void {
    const drawerToggle = document.getElementById('my-drawer-4') as HTMLInputElement;
    if (drawerToggle) {
      drawerToggle.checked = false;
    }
  }

  private showCard(lat: number, lng: number, title: string, description: string, eventId: string, startTime: string, endTime: string, startDate: string, endDate: string, prepDetails: any): void {
    if (this.mapCardComponent) {
      this.mapCardComponent.title = title;
      this.mapCardComponent.description = description;
      this.mapCardComponent.eventID = eventId;
      this.mapCardComponent.imageSource = this.randomImageService.getRandomImageSource();
      this.mapCardComponent.startTime = startTime;
      this.mapCardComponent.endTime = endTime;
      this.mapCardComponent.startDate = startDate;
      this.mapCardComponent.endDate = endDate;
      console.log(prepDetails);
      this.mapCardComponent.PreperationDetails = prepDetails;
      const card = document.getElementById('info-card');
      if (card) {
        card.classList.add('show');
        card.classList.remove('hide');
      }
    }
  }



  private fetchSeries(): void {
    fetch('https://events-system-back.wn.r.appspot.com/api/eventseries') // Replace with your actual API endpoint
      .then((response) => response.json())
      .then((series) => {
        this.series = series; // Store series for later use
        console.log('Fetched series:', series);
      })
      .catch((error) => console.error('Error fetching series:', error));
  }

  closeCard(): void {
    const card = document.getElementById('info-card');
    if (card) {
      card.classList.remove('show');
      card.classList.add('hide');
    }
  }

  private createPopupContent(lat: number, lng: number, description: string): string {
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    return `${description}<br><a href="${mapsLink}" target="_blank">Open in Maps</a>`;
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.markers.forEach((marker, index) => {
      const event = this.events[index];
      if (event.title.toLowerCase().includes(searchTerm)) {
        marker.addTo(this.map!);
      } else {
        this.map!.removeLayer(marker);
      }
    });
  }

  onOtherClubClick(i: number) {
    const club = this.uniqueSocialClubs[i];
    if (this.otherCheckboxes[i]) {
      this.checkedSocialClubs.push(club);
    } else {
      const index = this.checkedSocialClubs.indexOf(club);
      if (index > -1) {
        this.checkedSocialClubs.splice(index, 1);
      }
    }
    console.log(this.checkedSocialClubs);
    this.filterMarkersBySocialClub();
    if (this.otherCheckboxes[i]) {
      this.allClubsChecked = false;
    }
  }

  onAllClubsClick() {
    if (this.allClubsChecked) {
      this.otherCheckboxes = this.otherCheckboxes.map(() => false);
      this.checkedSocialClubs = [];
    } else {
      this.checkedSocialClubs = [...this.uniqueSocialClubs];
    }
    this.filterMarkersBySocialClub();
  }

  private filterMarkersBySocialClub() {
    const checkedSocialClubsIds = this.checkedSocialClubs.map((club) => club.id);

    if (this.allClubsChecked || checkedSocialClubsIds.length === 0) {
      this.markers.forEach((marker) => marker.addTo(this.map!));
    } else {
      this.markers.forEach((marker) => {
        if (checkedSocialClubsIds.includes(marker.socialClub)) {
          marker.addTo(this.map!);
        } else {
          this.map!.removeLayer(marker);
        }
      });
    }
  }

  onOtherSeriesClick(i: number) {
    const series = this.series[i];
    if (this.otherSeriesCheckboxes[i]) {
      this.checkedSeries.push(series);
    } else {
      const index = this.checkedSeries.indexOf(series);
      if (index > -1) {
        this.checkedSeries.splice(index, 1);
      }
    }
    console.log(this.checkedSeries);
    this.filterMarkersBySeries();
    if (this.otherSeriesCheckboxes[i]) {
      this.allSeriesChecked = false;
    }
  }
  
  onAllSeriesClick() {
    if (this.allSeriesChecked) {
      this.otherSeriesCheckboxes = this.otherSeriesCheckboxes.map(() => false);
      this.checkedSeries = [];
    } else {
      this.checkedSeries = [...this.series];
    }
    this.filterMarkersBySeries();
  }
  
  private filterMarkersBySeries() {
    const checkedSeriesEventIds = this.checkedSeries.flatMap((series) => series.seriesEventIds);
  
    if (this.allSeriesChecked || checkedSeriesEventIds.length === 0) {
      this.markers.forEach((marker) => marker.addTo(this.map!));
    } else {
      this.markers.forEach((marker) => {
        if (checkedSeriesEventIds.includes(marker.eventId)) {
          marker.addTo(this.map!);
        } else {
          this.map!.removeLayer(marker);
        }
      });
    }
  }
}