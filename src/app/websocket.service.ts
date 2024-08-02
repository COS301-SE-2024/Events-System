import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private notificationSubject = new Subject<string>();

  constructor() {
    const socket = new SockJS('https://events-system-back.wn.r.appspot.com/socket');
    this.stompClient = Stomp.over(socket);
    this.stompClient.onConnect = (frame) => {
      console.log('Connected to WebSocket');
      this.stompClient.subscribe('/topic/notification' + Number(localStorage.getItem('ID')), message => {
        console.log('Received message:', message.body);
        this.notificationSubject.next(message.body);
      });
    };
    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };
  }

  connect() {
    console.log('Activating WebSocket connection');
    this.stompClient.activate();
  }

  get notifications() {
    return this.notificationSubject.asObservable();
  }
}