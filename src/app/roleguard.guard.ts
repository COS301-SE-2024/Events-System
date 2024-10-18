import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate: CanActivateFn = (): boolean | Observable<boolean> | Promise<boolean> => {
    if (this.authService.ismanager()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}