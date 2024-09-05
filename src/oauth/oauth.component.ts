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
                // Get the current UTC time in ISO 8601 format
                const now = new Date().toISOString();

                await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=50&timeMin=${encodeURIComponent(now)}&orderBy=startTime&singleEvents=true`, {
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
                
                    console.log("Rsvp'd events for employeeId " + employeeId + ": " + eventIds);
                
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
                        console.log(`No matching Google Calendar event found for eventId: ${googleEventId}`);
                        continue; // Skip to the next eventId
                      }
                
                      // Compare the events
                      const googleEvent = {
                        summary: event.title,
                        location: event.location,
                        description: `
                          ${event.description}
                
                          Agendas:
                          - ${event.eventAgendas.join("\n    - ")}
                
                          Preparations:
                          - ${event.eventPreparation.join("\n    - ")}
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
                      // const discrepancies = JSON.stringify(googleEvent) !== JSON.stringify(matchingGoogleEvent);
                      console.log("Event with ID: " + googleEventId + " and " + matchingGoogleEvent.extendedProperties?.private?.eventId);
                      console.log(JSON.stringify(googleEvent.summary) == JSON.stringify(matchingGoogleEvent.summary));
                      console.log(googleEvent.location == matchingGoogleEvent.location);
                      console.log(googleEvent.description == matchingGoogleEvent.description);
                      console.log(JSON.stringify(googleEvent.start.dateTime) == JSON.stringify(matchingGoogleEvent.start.dateTime).split('+')[0] + "\"");
                      console.log(JSON.stringify(googleEvent.end.dateTime) == JSON.stringify(matchingGoogleEvent.end.dateTime).split('+')[0] + "\"");
                      console.log(JSON.stringify(googleEvent.extendedProperties) == JSON.stringify(matchingGoogleEvent.extendedProperties));
                      console.log(JSON.stringify(googleEvent.source) == JSON.stringify(matchingGoogleEvent.source));
                      console.log(JSON.stringify(googleEvent.reminders) == JSON.stringify(matchingGoogleEvent.reminders));

                      const discrepancies = JSON.stringify(googleEvent.summary) !== JSON.stringify(matchingGoogleEvent.summary) ||
                                            JSON.stringify(googleEvent.location) !== JSON.stringify(matchingGoogleEvent.location) || 
                                            JSON.stringify(googleEvent.description) !== JSON.stringify(matchingGoogleEvent.description) ||
                                            JSON.stringify(googleEvent.start.dateTime) !== JSON.stringify(matchingGoogleEvent.start.dateTime).split('+')[0] + "\"" || 
                                            JSON.stringify(googleEvent.end.dateTime) !== JSON.stringify(matchingGoogleEvent.end.dateTime).split('+')[0] + "\"" ||
                                            JSON.stringify(googleEvent.extendedProperties) !== JSON.stringify(matchingGoogleEvent.extendedProperties) ||
                                            JSON.stringify(googleEvent.source) !== JSON.stringify(matchingGoogleEvent.source) || 
                                            JSON.stringify(googleEvent.reminders) !== JSON.stringify(matchingGoogleEvent.reminders);
                
                      if (discrepancies) {
                        console.log(`Discrepancies found, updating Google Calendar event with eventId: ${googleEventId}`);
                
                        // Step 5: Update the Google Calendar event
                        await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${matchingGoogleEvent.id}`, {
                          method: 'PATCH',
                          headers: {
                            "Authorization": `Bearer ${ACCESS_TOKEN}`,
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(googleEvent),
                        });
                        console.log('Google Calendar event updated successfully');
                        // console.log("Upcoming events:");
                        // events.forEach((event: any) => {
                        //   const start = event.start.dateTime || event.start.date;
                        //   console.log(`${start} - ${event.summary}`);
                        // });
                      } else {
                        console.log('No discrepancies found for eventId: ' + googleEventId);
                      }
                    }
                  } catch (error) {
                    console.error('Error fetching, comparing, or updating events:');
                  }

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