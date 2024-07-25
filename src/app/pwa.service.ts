import { Injectable } from '@angular/core';
import {fromEvent, ReplaySubject, take, mergeMap, Observable} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";

interface BeforeInstallPrompt extends Event {
  prompt: () => Promise<void>; // Corrected to match the spec
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private beforeInstallPromptEvent: BeforeInstallPrompt | null = null;

  constructor() {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault(); // Prevent the mini-infobar from appearing on mobile
      this.beforeInstallPromptEvent = event as BeforeInstallPrompt;
    });
  }

  promptUserForInstallation() {
    if (this.beforeInstallPromptEvent) {
      this.beforeInstallPromptEvent.prompt(); // Show the install prompt
      this.beforeInstallPromptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        this.beforeInstallPromptEvent = null; // Reset the prompt event after showing it
      });
    }else {
      console.log('No installation prompt available');
    }
  }
}