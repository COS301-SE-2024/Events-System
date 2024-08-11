import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-oauth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oauth.component.html',
  styleUrl: './oauth.component.css',
})
export class OauthComponent implements OnInit{
  constructor(
    private route: ActivatedRoute,
    private router: Router
  )
  {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      const code = params['code'];
      if (code) {
        console.log('Authorization code:', code);

        const baseUrl = 'https://oauth2.googleapis.com/token';
        const clientId = 'client_id=';
        const clientSecret = 'client_secret=';
        const redirectUri = 'redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Foauth';
        const grantType = 'grant_type=authorization_code';
        //const code = 'YOUR_AUTHORIZATION_CODE'; // replace with actual authorization code
        
        const fullUrl = `code=${code}&${clientId}&${clientSecret}&${grantType}&${redirectUri}`;
        
        console.log(decodeURIComponent(fullUrl));
        
        try {
          const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: fullUrl
          })
          .then(data => data.json())
          .then(async data => {
            console.log("Access token: " + data.access_token);
            await fetch('https://www.googleapis.com/userinfo/v2/me', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.access_token}`
              }
            })
            .then(info => info.json())
            .then(async info => {
              console.log("User info: " + JSON.stringify(info));

              await fetch('http://localhost:8080/api/v1/auth/google', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body:  JSON.stringify(info)
              })
              .then(authData => authData.json())
              .then(authData => {
                console.log("authData: " + authData.access_token);
                document.cookie = `jwt=${authData.access_token}; path=/; expires=` + new Date(new Date().getTime() + 15 * 60 * 1000).toUTCString();           // Expiry set to 15 minutes
                document.cookie = `refresh=${authData.refresh_token}; path=/; expires=` + new Date(new Date().getTime() + 24* 60 * 60 * 1000).toUTCString();  // Expiry set to 24 hours

                this.router.navigate(['']);
              })
            })
          });
        
          //const data = await response.json();
          //console.log(data);


          //this.sendCodeToBackend(data);
        } catch (error) {
          console.error('Error:', error);
        }
      //console.log("Google tokens: " + response);
      //window.location.href = `${baseUrl}?$${clientId}&${clientSecret}&${redirectUri}&${code}&${o2v}&${ddm}&${flowName}`;


        } else {
        console.error('Authorization code not found in the URL');
      }
    });
  }

  private async sendCodeToBackend(code: any): Promise<void> {
    const backendEndpoint = 'http://localhost:8080/api/v1/auth/google';
    
    try {
      const response = await fetch(backendEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(code)
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
