import { Injectable } from '@angular/core';
import { Observable, from, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:8080/notify';


  sendNotification(Number: number, eventId: number, Message: any): Observable<string> {
    const event = {
      employeeId: Number,
      eventId: eventId,
      message: Message
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
}