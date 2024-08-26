import { Injectable } from '@angular/core';
import { Observable, from, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'https://mock-api-url.com/notify/notify';


  sendNotification(Number: number, eventId: number, Message: string, eventtitle: string): Observable<string> {
    const event = {
      employeeId: Number,
      eventId: eventId,
      message: Message,
      eventTitle: eventtitle,
    };

    return from(fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }).then(response => response.text()));  }

    private notificationSubject = new Subject<void>();

    notification$ = this.notificationSubject.asObservable();
  
    notify() {
      this.notificationSubject.next();
    }

    sendSeriesNotification(Number: number, seriesId: number, Message: string, seriesTitle: string): Observable<string> {
      const event = {
        employeeId: Number,
        seriesId: seriesId,
        message: Message,
        seriesTitle: seriesTitle,
      };
  
      return from(fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      }).then(response => response.text()));  }

    }
