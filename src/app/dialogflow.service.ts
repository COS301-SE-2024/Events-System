import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogflowService {
  private baseUrl = 'https://events-system-back.wn.r.appspot.com/api/dialogflow';
  private positionalWords = ['near', 'around', 'location', 'close', 'find', 'nearby'];

  async detectIntent(text: string, sessionId: string, userID: number): Promise<string> {
    if (this.containsPositionalWords(text)) {
      const location = await this.getUserLocation();
      const mess = {
        text: text,
        sessionId: sessionId,
        userID: userID,
        latitude: location.latitude,
        longitude: location.longitude
      };
      const response = await fetch(`${this.baseUrl}/localdetectIntent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mess)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseText = await response.text();
      console.log(responseText);
      return responseText;
    } else {
      const mess = {
        text: text,
        sessionId: sessionId,
        userID: userID
      };
      const response = await fetch(`${this.baseUrl}/detectIntent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mess)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseText = await response.text();
      console.log(responseText);
      return responseText;
    }
  }

  private containsPositionalWords(text: string): boolean {
    return this.positionalWords.some(word => new RegExp(`\\b${word}\\b`, 'i').test(text));
  }

  private getUserLocation(): Promise<{ latitude: number, longitude: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        }, error => {
          reject(error);
        });
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }
}