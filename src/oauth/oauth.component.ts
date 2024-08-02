import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-oauth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oauth.component.html',
  styleUrl: './oauth.component.css',
})
export class OauthComponent implements OnInit{
  constructor(private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        console.log('Authorization code:', code);
        this.sendCodeToBackend(code);

        } else {
        console.error('Authorization code not found in the URL');
      }
    });
  }

  private async sendCodeToBackend(code: string): Promise<void> {
    const backendEndpoint = 'http://localhost:8080/api/v1/auth/google';
    
    try {
      const response = await fetch(backendEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Token received from backend:', data);
      // Handle the response, store the token, and navigate to the desired page
      localStorage.setItem('access_token', data.access_token);
    } catch (error) {
      console.error('Error sending code to backend:', error);
    }
  }
}
