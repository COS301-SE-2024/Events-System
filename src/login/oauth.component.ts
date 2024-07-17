// oauth-callback.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-oauth-callback',
  template: `<p>Logging in...</p>`,
})
export class OAuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      if (code) {
        this.exchangeCodeForToken(code);
      } else {
        // Handle error or invalid code
        console.error('Authorization code not found');
        this.router.navigate(['/login']);
      }
    });
  }

  exchangeCodeForToken(code: string) {
    // Replace with your backend endpoint to exchange the code for a token
    const tokenEndpoint = 'https://events-system-back.wn.r.appspot.com/api/v1/auth/authenticate';

    this.http
      .post(tokenEndpoint, { code })
      .subscribe(
        (response: any) => {
          // Handle the response, store the token, and navigate to the desired page
          localStorage.setItem('access_token', response.access_token);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Error exchanging code for token:', error);
          this.router.navigate(['/login']);
        }
      );
  }
}
