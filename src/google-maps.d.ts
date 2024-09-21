// src/google-maps.d.ts
declare namespace google {
  export namespace maps {
    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      zoomControl?: boolean;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class Geocoder {
      geocode(
        request: { address: string },
        callback: (results: any, status: any) => void
      ): void;
    }
  }
}