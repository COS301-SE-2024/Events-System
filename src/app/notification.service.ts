import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:8080/notify'; // Replace with your backend URL


  sendNotification(): Observable<string> {
    return from(fetch(this.apiUrl).then(response => response.text()));
  }
}