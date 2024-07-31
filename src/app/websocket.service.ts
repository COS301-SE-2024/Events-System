// src/app/services/websocket.service.ts
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
    const socket = new SockJS('http://localhost:8080/socket');
    this.stompClient = Stomp.over(socket);
    this.stompClient.onConnect = (frame) => {
      this.stompClient.subscribe('/topic/notification' + Number(localStorage.getItem('ID')), message => {
        this.notificationSubject.next(message.body);
      });
    };
  }

  connect() {
    this.stompClient.activate();
  }

  get notifications() {
    return this.notificationSubject.asObservable();
  }
}