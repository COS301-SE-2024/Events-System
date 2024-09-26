// google-maps-loader.service.ts
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {
  apiKey =  `${environment.GOOGLE_API_KEY}`;
  private apiLoaded = false;

  load(): Promise<void> {
    if (this.apiLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (typeof google !== 'undefined' && google.maps) {
          this.apiLoaded = true;
          resolve();
        } else {
          reject(new Error('Google Maps API failed to load.'));
        }
      };
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }
}