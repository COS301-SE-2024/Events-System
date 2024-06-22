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

  onRegister(event: Event) {
    event.preventDefault();

    if (this.registerForm.valid) {
      const formData = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value
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

  onLogin() {
    if (this.loginForm.valid) {
      const formData = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };
  
      // Assuming API endpoint for registration
      fetch('https://events-system-back.wn.r.appspot.com/api/v1/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        // Navigate to home page with credentials as state data
        fetch('https://events-system-back.wn.r.appspot.com/api/v1/auth/'+ data.access_token, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        .then(response => response.json())
        .then(data2 => {
          // Navigate to home page with credentials as state data
          localStorage.setItem('ID', data2);
        })

        const employeeId = localStorage.getItem('ID');
        if (employeeId) {
          this.http.get(`https://events-system-back.wn.r.appspot.com/api/employees/${employeeId}`).subscribe(
            (data: any) => {
              //console.log(data);
              localStorage.setItem('employeeData', JSON.stringify(data));
              //log the data to the console
              console.log(localStorage.getItem('employeeData'));  
            },
            (error) => {
              console.error('Error fetching employee data', error);
            }
          );
        } else {
          console.warn('No ID found in localStorage');
        }

        this.router.navigate(['/']);
      })
      .catch(error => {
        console.error('Error registering:', JSON.stringify(formData));
      });
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }
}