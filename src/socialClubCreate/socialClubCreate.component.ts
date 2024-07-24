import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-social-club-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './socialClubCreate.component.html',
  styleUrl: './socialClubCreate.component.css',
})
export class SocialClubCreateComponent {
  createForm: FormGroup;
  hostID: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient
  )
  {
    this.createForm = this.fb.group({
      ownerID: [],
      name: [],
      description: [],
      pictureLink: [],
      summaryDescription: [],
      categories: []
    });
  }

  createClub() {
    if (this.createForm.valid) {
        console.log("bums");
        
        try{
          fetch('https://events-system-back.wn.r.appspot.com/api/v1/auth//' + this.getCookie("jwt"))
          .then(response => response.json())
          .then(data => {
              // Show the success toast
              this.hostID = data;
              console.log("hostID :" + data);
          });
        }
        catch (error)
        {
          console.error('Error:', error);
          console.error('Error during ownerID retrieval:', error);
        }
       //this.hostID = localStorage.getItem("ID");

        const formData = {
          ownerID: this.hostID,
          name: this.createForm.get('name')?.value,
          description: this.createForm.get('description')?.value,
          pictureLink: this.createForm.get('pictureLink')?.value,
          summaryDescription: this.createForm.get('summaryDescription')?.value,
          categories: this.createForm.get('categories')?.value
        };
        console.log("Form data: " + formData);
        
        try{
          fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(response => response.json())
          .then(data => {
              // Show the success toast
              console.log(data);
          });
        }
        catch (error)
        {
          console.error('Error:', error);
          console.error('Error during club creation:', error);
        }
      };

    this.router.navigate(['/socialclublisting']);
  }

  async checkCookies() {
    // Get all cookies
    const cookies = document.cookie.split('; ');

    // Find the cookie by name
    let accessToken = null;
    let refreshToken = null;
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === "jwt") {
            accessToken = decodeURIComponent(value);
            break;
        }
    }
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === "refresh") {
          refreshToken = decodeURIComponent(value);
          break;
      }
  }
    
    if(!accessToken)        //If access token expired
    {
      if(!refreshToken)     //If refresh token expired
      {
        this.router.navigate(["/login"]);
      }

      try {
        const response = await fetch("https://events-system-back.wn.r.appspot.com/api/v1/auth/refresh-token", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getCookie("refresh")}`
            },
            body: JSON.stringify(FormData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const authData = await response.json();
        document.cookie = `jwt=${authData.access_token}; path=/; expires=` + new Date(new Date().getTime() + 15 * 60 * 1000).toUTCString();
        document.cookie = `refresh=${authData.refresh_token}; path=/; expires=` + new Date(new Date().getTime() + 24* 60 * 60 * 1000).toUTCString();
        console.log('Token refresh successful');
        // Handle the response data as needed
      } catch (error) {
          console.error('Error refreshing token');
          // Handle errors appropriately
      }
    }
  }


  getCookie(cookieName: string) {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

}
