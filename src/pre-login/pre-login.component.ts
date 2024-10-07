import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-pre-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pre-login.component.html',
  styleUrl: './pre-login.component.css',
})
export class PreLoginComponent {
  async signInWithGoogle() {
    let fullUrl = ``;
    const baseUrl = 'https://accounts.google.com/o/oauth2/auth/oauthchooseaccount';
    const responseType = 'response_type=code';
    const clientId = 'client_id=' + environment.CLIENT_ID;
    const scope = 'scope=profile%20email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar';
    const redirectUri = 'redirect_uri=https%3A%2F%2Fevents-system.org%2Foauth';
    const service = 'service=lso';
    const o2v = 'o2v=1';
    const ddm = 'ddm=0';
    const flowName = 'flowName=GeneralOAuthFlow';
    const accessType = 'access_type=offline';  // Added to request a refresh token

    if(!localStorage.getItem('ID') || !localStorage.getItem('googleRefresh') || localStorage.getItem('googleRefresh') === 'undefined') {
      fullUrl = `${baseUrl}?${responseType}&${clientId}&${scope}&${redirectUri}&${service}&${o2v}&${ddm}&${flowName}&${accessType}`;
    }
    else {
      fullUrl = `${baseUrl}?${responseType}&${clientId}&${scope}&${redirectUri}&${service}&${o2v}&${ddm}&${flowName}`;
    }

    window.location.href = fullUrl;
  }
}
