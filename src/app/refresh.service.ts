import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  private refreshNavbarSubject = new Subject<void>();
  refreshNavbar$ = this.refreshNavbarSubject.asObservable();

  triggerRefreshNavbar() {
    this.refreshNavbarSubject.next();
  }
}