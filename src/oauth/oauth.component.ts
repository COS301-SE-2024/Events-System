import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { response } from 'express';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-oauth',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './oauth.component.html',
  styleUrl: './oauth.component.css',
})
export class OauthComponent implements OnInit{
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  )
  {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      const code = params['code'];
      if (code) {
        console.log('Authorization code:', code);

        const baseUrl = 'https://oauth2.googleapis.com/token';
        const clientId = 'client_id=' + environment.CLIENT_ID;
        const clientSecret = 'client_secret=' + environment.CLIENT_SECRET;
        const redirectUri = 'redirect_uri=https%3A%2F%2Fevents-system.org%2Foauth';
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
            const ACCESS_TOKEN = data.access_token;
            
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

              await fetch('https://events-system-back.wn.r.appspot.com/api/v1/auth/google', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body:  JSON.stringify(info)
              })
              .then(authData => authData.json())
              .then(async authData => {
                // Get employee ID using access token
                const idResponse = await fetch('https://events-system-back.wn.r.appspot.com/api/v1/auth/' + authData.access_token, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
                const idData = await idResponse.json();
                
                // Store employee ID in local storage
                localStorage.setItem('ID', idData);
                localStorage.setItem('googleSignIn', "true");
                
                // Fetch employee data using ID
                const employeeId = localStorage.getItem('ID');
                if (employeeId) {
                  const employeeResponse = await this.http.get(`https://events-system-back.wn.r.appspot.com/api/employees/${employeeId}`).toPromise();
                  localStorage.setItem('employeeData', JSON.stringify(employeeResponse));
                  console.log('Employee data:', localStorage.getItem('employeeData'));
                } else {
                  console.warn('No ID found in localStorage');
                }
                document.cookie = `jwt=${authData.access_token}; path=/; expires=` + new Date(new Date().getTime() + 15 * 60 * 1000).toUTCString();           // Expiry set to 15 minutes
                document.cookie = `refresh=${authData.refresh_token}; path=/; expires=` + new Date(new Date().getTime() + 24* 60 * 60 * 1000).toUTCString();  // Expiry set to 24 hours
                document.cookie = `google=${ACCESS_TOKEN}; path=/; expires=` + new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toUTCString();  // Expiry set to 1 hour

                await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true', {
                  method: 'GET',
                  headers: {
                    "Authorization": `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                })
                .then(calendarData => calendarData.json())
                .then(async calendarData => {
                  const events = calendarData.items;
                  if (events.length === 0) {
                    console.log("No upcoming events found.");
                    return;
                  }

                  console.log("Upcoming events:");
                  events.forEach((event: any) => {
                    const start = event.start.dateTime || event.start.date;
                    console.log(`${start} - ${event.summary}`);
                  });
                })
                .then(() => {
                  this.router.navigate(['']);
                })
                .catch((error) => {
                  throw new Error(`API request failed: ${error}`);
                })

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
    const backendEndpoint = 'https://events-system-back.wn.r.appspot.com/api/v1/auth/google';
    
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