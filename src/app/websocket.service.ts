// src/app/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    // Open connection with the back-end socket
    public connect() {
        const socket = new SockJS(`http://localhost:8080/socket`);

        const stompClient = Stomp.over(socket);

        return stompClient;
    }
}