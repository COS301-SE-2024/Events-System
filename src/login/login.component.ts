import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
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
    private fb: FormBuilder
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
        console.log('Login successful:', data);
        // Navigate to home page with credentials as state data
        this.router.navigate(['/'], { state: { credentials: formData } });
      })
      .catch(error => {
        console.error('Error registering:', JSON.stringify(formData));
      });
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }
}