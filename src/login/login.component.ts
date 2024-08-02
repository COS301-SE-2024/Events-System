import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule], // Import necessary modules here
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMessage = '';
  registerForm: FormGroup;
  loginForm: FormGroup;
  isAPILoading = false;
  showloginsuccessToast = false;
  showregistersuccessToast = false;
  showloginfailToast = false;
  showregisterfailToast = false;
  hidePassword = true;
  googleClientId = '207465254722-7p4odomht6nnoc2cek9cb0j5jht2faos.apps.googleusercontent.com';
  redirectUri = 'http://localhost:4200/oauth/callback'; // e.g., http://localhost:4200/oauth/callback
  googleAuthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  responseType = 'code';
  scope = 'openid email profile';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER', Validators.required] // Default role is Employee
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  //delete employeeData and ID from localStorage if they were already set
  //whenever the login page is loaded
  ngOnInit() {
    localStorage.removeItem('employeeData');
    localStorage.removeItem('ID');
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.hidePassword ? 'password' : 'text';
  }

  onRegister(event: Event) {
    this.isAPILoading = true;
    event.preventDefault();

    if (this.registerForm.valid) {
      const formData = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      role: this.registerForm.get('role')?.value
    };
    console.log('Form data:', formData);
      // Assuming API endpoint for registration
      fetch('https://events-system-back.wn.r.appspot.com/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        this.showregistersuccessToast = true;
        this.isAPILoading = false;
        console.log('Registration successful:', data);
        setTimeout(() => {
          this.showregistersuccessToast = false;
          this.router.navigate(['']);
        }, 5000);
        // Optionally, navigate to another page on successful registration

      })
      .catch(error => {
        this.showregisterfailToast = true;
        this.isAPILoading = false;
        setTimeout(() => {
          this.showregisterfailToast = false;
        }, 10000);
        console.error('Error:', error);
      });
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }

  async onLogin() {
    this.isAPILoading = true;
    if (this.loginForm.valid) {
      const formData = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };
      try {
        // Authenticate user and get access token
        const authResponse = await fetch('https://events-system-back.wn.r.appspot.com/api/v1/auth/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const authData = await authResponse.json();
        
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
        document.cookie = `jwt=${authData.access_token}; path=/; expires=` + new Date(new Date().getTime() + 15 * 60 * 1000).toUTCString();

        // Fetch employee data using ID
        const employeeId = localStorage.getItem('ID');
        if (employeeId) {
          const employeeResponse = await this.http.get(`https://events-system-back.wn.r.appspot.com/api/employees/${employeeId}`).toPromise();
          localStorage.setItem('employeeData', JSON.stringify(employeeResponse));
          console.log('Employee data:', localStorage.getItem('employeeData'));
        } else {
          console.warn('No ID found in localStorage');
        }
        this.showloginsuccessToast = true;
        this.isAPILoading = false;
        // Hide the toast after 5 seconds
        setTimeout(() => {
          this.showloginsuccessToast = false;
          this.router.navigate(['']);
        }, 5000);
        // Navigate to profile page

      } catch (error) {
        this.showloginfailToast = true;
        this.isAPILoading = false;
        setTimeout(() => {
          this.showloginfailToast = false;
        }, 10000);
        console.error('Error:', error);
        console.error('Error during login:', error);
        this.errorMessage = 'Invalid credentials. Please try again.'; // Set error message for invalid credentials
        window.location.reload();
      }
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }

  async signInWithGoogle() {
    /*const googleRespnse = await fetch('http://localhost:8080/api/v1/auth/google', {
        method: 'POST', // Important for including cookies if needed
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });*/

      window.location.href = `https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?response_type=code&client_id=207465254722-7p4odomht6nnoc2cek9cb0j5jht2faos.apps.googleusercontent.com&scope=profile%20email&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fv1%2Fauth%2Fgoogle&service=lso&o2v=1&ddm=0&flowName=GeneralOAuthFlow`;
  }
}