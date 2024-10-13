import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { response } from 'express';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RefreshService } from 'src/app/refresh.service';
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
    private http: HttpClient,
    private refreshService: RefreshService
  )
  {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      const code = params['code'];
      const id = localStorage.getItem('ID');
      const refreshToken = localStorage.getItem('googleRefresh');

      if (code && refreshToken && localStorage.getItem('googleRefresh') !== "undefined") {
        const baseUrl = 'https://oauth2.googleapis.com/token';
        const clientId = 'client_id=' + environment.CLIENT_ID;
        const clientSecret = 'client_secret=' + environment.CLIENT_SECRET;
        const redirectUri = 'redirect_uri=https%3A%2F%2Fevents-system.org%2Foauth';
        const grantType = 'grant_type=refresh_token';
        const fullUrl = `${clientId}&${clientSecret}&${grantType}&${redirectUri}&refresh_token=${refreshToken}`;

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
              if(!info.family_name){
                info.family_name = " ";
              }
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
                }
                else {
                  this.router.navigate(["/login"]);
                }
                document.cookie = `jwt=${authData.access_token}; path=/; expires=` + new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toUTCString();           // Expiry set to 24 hours
                document.cookie = `refresh=${authData.refresh_token}; path=/; expires=` + new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toUTCString();  // Expiry set to 1 week
                document.cookie = `google=${ACCESS_TOKEN}; path=/; expires=` + new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toUTCString();  // Expiry set to 1 hour
                              // Check for calendar permissions
              const calendarResponse = await fetch(
                'https://www.googleapis.com/calendar/v3/users/me/calendarList',
                {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
            
              if (calendarResponse.ok) {
                // Get the current UTC time in ISO 8601 format
                const now = new Date().toISOString();

                await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=100&timeMin=${encodeURIComponent(now)}&orderBy=startTime&singleEvents=true`, {
                  method: 'GET',
                  headers: {
                    "Authorization": `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                })
                .then(calendarData => calendarData.json())
                .then(async calendarData => {
                  const events = calendarData.items;
                  if (events.length == null || events.length === 0) {
                    //console.log("No upcoming events found.");
                    return;
                  }

                  try {
                    // Fetch RSVP data from your API
                    const response = await fetch('https://events-system-back.wn.r.appspot.com/api/event-rsvps');
                    const data = await response.json();
                
                    // Filter RSVPs based on the specified employeeId
                    const rsvps = Array.isArray(data) ? data : [data];
                    const filteredRsvps = rsvps.filter(rsvp => rsvp.employeeId.toString() === employeeId);
                
                    // Extract the event IDs for the filtered RSVPs
                    const eventIds = filteredRsvps.map(rsvp => rsvp.eventId);

                    // Iterate through each eventId and perform the comparison and update logic
                    for (const eventId of eventIds) {
                      // Fetch the event data for the current eventId
                      const eventResponse = await fetch(`https://events-system-back.wn.r.appspot.com/api/events/${eventId}`, {
                        method: 'GET',
                        credentials: "include",
                        headers: {
                          'Content-Type': 'application/json',
                        }
                      });
                      const event = await eventResponse.json();
                
                      const googleEventId = event.eventId.toString();
                
                      // Fetch the corresponding event from Google Calendar
                      const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                        method: 'GET',
                        headers: {
                          "Authorization": `Bearer ${ACCESS_TOKEN}`,
                          "Content-Type": "application/json",
                        },
                      });
                      const calendarData = await calendarResponse.json();
                
                      const matchingGoogleEvent = calendarData.items.find((googleEvent: any) =>
                        googleEvent.extendedProperties?.private?.eventId === googleEventId
                      );
                
                      if (!matchingGoogleEvent) {
                        continue; // Skip to the next eventId
                      }
                
                      // Compare the events
                      const agendas = `<ul>${event.eventAgendas.map((agenda: any) => `<li>${agenda}</li>`).join("")}</ul>`
                      const preps = `<ul>${event.eventPreparation.map((preparation: any) => `<li>${preparation}</li>`).join("")}</ul>`
                      const googleEvent = {
                        summary: event.title,
                        location: event.location,
                        description: `
                          
                        ${event.description}
                          <hr><h3>Agenda:</h3>${agendas}
                      <h3>Preparation Details:</h3>${preps}
        
                        `,
                        start: {
                          dateTime: `${event.startDate}T${event.startTime}`,
                          timeZone: 'Africa/Johannesburg',
                        },
                        end: {
                          dateTime: `${event.endDate}T${event.endTime}`,
                          timeZone: 'Africa/Johannesburg',
                        },
                        extendedProperties: {
                          private: {
                            eventId: event.eventId.toString(),
                            hostId: event.hostId.toString(),
                            socialClub: event.socialClub.toString(),
                          },
                        },
                        source: {
                          url: event.eventPictureLink,
                          title: 'Event Picture',
                        },
                        reminders: {
                          useDefault: false,
                          overrides: [
                            { method: 'email', minutes: 24 * 60 },
                            { method: 'popup', minutes: 10 },
                          ],
                        },
                      };
                
                      // Check for discrepancies
                      const discrepancies = JSON.stringify(googleEvent.summary) !== JSON.stringify(matchingGoogleEvent.summary) ||
                                            JSON.stringify(googleEvent.location) !== JSON.stringify(matchingGoogleEvent.location) || 
                                            JSON.stringify(googleEvent.description) !== JSON.stringify(matchingGoogleEvent.description) ||
                                            JSON.stringify(googleEvent.start.dateTime) !== JSON.stringify(matchingGoogleEvent.start.dateTime).split('+')[0] + "\"" || 
                                            JSON.stringify(googleEvent.end.dateTime) !== JSON.stringify(matchingGoogleEvent.end.dateTime).split('+')[0] + "\"" ||
                                            JSON.stringify(googleEvent.extendedProperties) !== JSON.stringify(matchingGoogleEvent.extendedProperties) ||
                                            JSON.stringify(googleEvent.source) !== JSON.stringify(matchingGoogleEvent.source) || 
                                            JSON.stringify(googleEvent.reminders) !== JSON.stringify(matchingGoogleEvent.reminders);
                
                      if (discrepancies) {
                        // Update the Google Calendar event
                        await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${matchingGoogleEvent.id}`, {
                          method: 'PATCH',
                          headers: {
                            "Authorization": `Bearer ${ACCESS_TOKEN}`,
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(googleEvent),
                        });
                      }
                      else {
                        continue;
                      }
                    }
                  }
                  catch (error) {
                    // window.location.reload();
                    console.log(error);
                    const employeeId = localStorage.getItem('ID');
                    if (employeeId) {
                      this.router.navigate(['']);
                    } else {
                      this.router.navigate(['/login']);
                    }
                  }
                })
                .then(() => {
                  this.refreshService.triggerRefreshNavbar();
                  this.router.navigate(['']);
                })
                .catch((error) => {
                  const employeeId = localStorage.getItem('ID');
                  if (employeeId) {
                    this.router.navigate(['']);
                  } else {
                    this.router.navigate(['/login']);
                  }
                })
              }
              })
            })
          });
        
          //const data = await response.json();
          //console.log(data);


          //this.sendCodeToBackend(data);
        }
        catch (error) {
          // window.location.reload();
          console.log(error);
          const employeeId = localStorage.getItem('ID');
          if (employeeId) {
            this.router.navigate(['']);
          } else {
            this.router.navigate(['/login']);
          }
        }
      }
      else if (code) {
        const baseUrl = 'https://oauth2.googleapis.com/token';
        const clientId = 'client_id=' + environment.CLIENT_ID;
        const clientSecret = 'client_secret=' + environment.CLIENT_SECRET;
        const redirectUri = 'redirect_uri=https%3A%2F%2Fevents-system.org%2Foauth';
        const grantType = 'grant_type=authorization_code';
        //const code = 'YOUR_AUTHORIZATION_CODE'; // replace with actual authorization code
        
        const fullUrl = `code=${code}&${clientId}&${clientSecret}&${grantType}&${redirectUri}`;
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
            const ACCESS_TOKEN = data.access_token;
            const REFRESH_TOKEN = data.refresh_token;
            
            await fetch('https://www.googleapis.com/userinfo/v2/me', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${data.access_token}` // Access token from Google
              }
          })
          .then(info => info.json())
          .then(async info => {
            if(!info.family_name){
              info.family_name = " ";
            }
              // Include the refresh token in the body along with user info
              const requestBody = {
                  ...info, // Spread the user info object
                  refresh_token: data.refresh_token // Add the refresh token
              };
          
              // POST request to your backend with the user info and refresh token
              await fetch('https://events-system-back.wn.r.appspot.com/api/v1/auth/google', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(requestBody) // Send user info and refresh token in body
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
                }
                else {
                  this.router.navigate(["/login"]);
                }
                document.cookie = `jwt=${authData.access_token}; path=/; expires=` + new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toUTCString();           // Expiry set to 24 hours
                document.cookie = `refresh=${authData.refresh_token}; path=/; expires=` + new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toUTCString();  // Expiry set to 1 week
                document.cookie = `google=${ACCESS_TOKEN}; path=/; expires=` + new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toUTCString();  // Expiry set to 1 hour
                localStorage.setItem('googleRefresh', REFRESH_TOKEN);
              // Check for calendar permissions
              const calendarResponse = await fetch(
                'https://www.googleapis.com/calendar/v3/users/me/calendarList',
                {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
            
              if (calendarResponse.ok) {
                // Get the current UTC time in ISO 8601 format
                const now = new Date().toISOString();
  
                await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=100&timeMin=${encodeURIComponent(now)}&orderBy=startTime&singleEvents=true`, {
                  method: 'GET',
                  headers: {
                    "Authorization": `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                  },
                })
                .then(calendarData => calendarData.json())
                .then(async calendarData => {
                  const events = calendarData.items;
                  if (events.length == null || events.length === 0) {
                    //console.log("No upcoming events found.");
                    return;
                  }
  
                  try {
                    // Fetch RSVP data from your API
                    const response = await fetch('https://events-system-back.wn.r.appspot.com/api/event-rsvps');
                    const data = await response.json();
                
                    // Filter RSVPs based on the specified employeeId
                    const rsvps = Array.isArray(data) ? data : [data];
                    const filteredRsvps = rsvps.filter(rsvp => rsvp.employeeId.toString() === employeeId);
                
                    // Extract the event IDs for the filtered RSVPs
                    const eventIds = filteredRsvps.map(rsvp => rsvp.eventId);
  
                    // Iterate through each eventId and perform the comparison and update logic
                    for (const eventId of eventIds) {
                      // Fetch the event data for the current eventId
                      const eventResponse = await fetch(`https://events-system-back.wn.r.appspot.com/api/events/${eventId}`, {
                        method: 'GET',
                        credentials: "include",
                        headers: {
                          'Content-Type': 'application/json',
                        }
                      });
                      const event = await eventResponse.json();
                
                      const googleEventId = event.eventId.toString();
                
                      // Fetch the corresponding event from Google Calendar
                      const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                        method: 'GET',
                        headers: {
                          "Authorization": `Bearer ${ACCESS_TOKEN}`,
                          "Content-Type": "application/json",
                        },
                      });
                      const calendarData = await calendarResponse.json();
                
                      const matchingGoogleEvent = calendarData.items.find((googleEvent: any) =>
                        googleEvent.extendedProperties?.private?.eventId === googleEventId
                      );
                
                      if (!matchingGoogleEvent) {
                        continue; // Skip to the next eventId
                      }
                
                      // Compare the events
                      const agendas = `<ul>${event.eventAgendas.map((agenda: any) => `<li>${agenda}</li>`).join("")}</ul>`
                      const preps = `<ul>${event.eventPreparation.map((preparation: any) => `<li>${preparation}</li>`).join("")}</ul>`
                      const googleEvent = {
                        summary: event.title,
                        location: event.location,
                        description: `
                          
                        ${event.description}
                          <hr><h3>Agenda:</h3>${agendas}
                      <h3>Preparation Details:</h3>${preps}
        
                        `,
                        start: {
                          dateTime: `${event.startDate}T${event.startTime}`,
                          timeZone: 'Africa/Johannesburg',
                        },
                        end: {
                          dateTime: `${event.endDate}T${event.endTime}`,
                          timeZone: 'Africa/Johannesburg',
                        },
                        extendedProperties: {
                          private: {
                            eventId: event.eventId.toString(),
                            hostId: event.hostId.toString(),
                            socialClub: event.socialClub.toString(),
                          },
                        },
                        source: {
                          url: event.eventPictureLink,
                          title: 'Event Picture',
                        },
                        reminders: {
                          useDefault: false,
                          overrides: [
                            { method: 'email', minutes: 24 * 60 },
                            { method: 'popup', minutes: 10 },
                          ],
                        },
                      };
                
                      // Check for discrepancies
                      const discrepancies = JSON.stringify(googleEvent.summary) !== JSON.stringify(matchingGoogleEvent.summary) ||
                                            JSON.stringify(googleEvent.location) !== JSON.stringify(matchingGoogleEvent.location) || 
                                            JSON.stringify(googleEvent.description) !== JSON.stringify(matchingGoogleEvent.description) ||
                                            JSON.stringify(googleEvent.start.dateTime) !== JSON.stringify(matchingGoogleEvent.start.dateTime).split('+')[0] + "\"" || 
                                            JSON.stringify(googleEvent.end.dateTime) !== JSON.stringify(matchingGoogleEvent.end.dateTime).split('+')[0] + "\"" ||
                                            JSON.stringify(googleEvent.extendedProperties) !== JSON.stringify(matchingGoogleEvent.extendedProperties) ||
                                            JSON.stringify(googleEvent.source) !== JSON.stringify(matchingGoogleEvent.source) || 
                                            JSON.stringify(googleEvent.reminders) !== JSON.stringify(matchingGoogleEvent.reminders);
                
                      if (discrepancies) {
                        // Update the Google Calendar event
                        await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${matchingGoogleEvent.id}`, {
                          method: 'PATCH',
                          headers: {
                            "Authorization": `Bearer ${ACCESS_TOKEN}`,
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(googleEvent),
                        });
                      }
                      else {
                        continue;
                      }
                    }
                  }
                  catch (error) {
                    // window.location.reload();
                    console.log(error);
                    const employeeId = localStorage.getItem('ID');
                    if (employeeId) {
                      this.router.navigate(['']);
                    } else {
                      this.router.navigate(['/login']);
                    }
                  }
                })
                .then(() => {
                  this.refreshService.triggerRefreshNavbar();
                  this.router.navigate(['']);
                })
                .catch((error) => {
                  console.log(error);
                  const employeeId = localStorage.getItem('ID');
                  if (employeeId) {
                    this.router.navigate(['']);
                  } else {
                    this.router.navigate(['/login']);
                  }
                })
              }
              })
          
            })
          });
        
          //const data = await response.json();
          //console.log(data);
  
  
          //this.sendCodeToBackend(data);
        }
        catch (error) {
          // window.location.reload();
          console.log(error);
          const employeeId = localStorage.getItem('ID');
          if (employeeId) {
            this.router.navigate(['']);
          } else {
            this.router.navigate(['/login']);
          }
        }
        }
        else {
        this.router.navigate(["/login"]);
      }
    });
  }
}