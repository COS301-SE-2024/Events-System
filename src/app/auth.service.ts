import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn(): boolean {
    // Implement your logic to check if the user is logged in
    return !!localStorage.getItem('ID'); // Example implementation
  }
}