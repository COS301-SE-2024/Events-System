import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

const myCredentials = {
  username: 'myUsername',
  password: 'myPassword'
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    if (state?.['credentials']) {
      this.loginUser(state['credentials']);
    }
  }

  async loginUser(myCredentials: any) {
    const response = await fetch('https://events-system-back.wn.r.appspot.com/api/v1/auth/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(myCredentials)
    })
          .then(response => response.json())
      .then(data => {
        console.log('Login successful:', data);
        sessionStorage.setItem('JWT', data.accessToken);
      });

    // if (response.ok) {
    //   console.log(response);
    //   const jwt = response.headers.get('Set-Cookie')?.split(';')[0].split('=')[1];
    //   console.log(jwt);
    //   // Now you can use the jwt token to get the userID
    // }
  }
}