import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:8080/notify';


  sendNotification(Number: number): Observable<string> {
    const event = {
      employeeId: Number,
      eventId: 98,
      message: "test notification"
    };

    return from(fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }).then(response => response.text()));  }
}