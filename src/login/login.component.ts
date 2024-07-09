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

  onRegister(event: Event) {
    event.preventDefault();

    if (this.registerForm.valid) {
      const formData = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      role: this.registerForm.get('role')?.value
    };

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
        console.log('Registration successful:', data);
        // Optionally, navigate to another page on successful registration
        this.router.navigate(['']);
      })
      .catch(error => {
        console.error('Error registering:', error);
      });
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }

  async onLogin() {
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

        // Fetch employee data using ID
        const employeeId = localStorage.getItem('ID');
        if (employeeId) {
          const employeeResponse = await this.http.get(`https://events-system-back.wn.r.appspot.com/api/employees/${employeeId}`).toPromise();
          localStorage.setItem('employeeData', JSON.stringify(employeeResponse));
          console.log('Employee data:', localStorage.getItem('employeeData'));
        } else {
          console.warn('No ID found in localStorage');
        }

        // Navigate to profile page
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Error during login:', error);
        this.errorMessage = 'Invalid credentials. Please try again.'; // Set error message for invalid credentials
        window.location.reload();
      }
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }
}
