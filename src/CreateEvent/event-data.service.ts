// event-data.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventDataService {
  private data: { [key: number]: any } = {};

  setData(step: number, data: any) {
    this.data[step] = data;
  }

  getData(step: number) {
    return this.data[step];
  }
}