import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, ValidationErrors,  FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
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
  forgotPasswordForm: FormGroup;
  errorMessage = '';
  registerForm: FormGroup;
  loginForm: FormGroup;
  isAPILoading = false;
  showloginsuccessToast = false;
  showregistersuccessToast = false;
  showemailsuccessToast = false;
  showloginfailToast = false;
  showregisterfailToast = false;
  showemailfailToast = false;
  hidePassword = true;
  hidePassword1 = true;
  hidePassword2 = true;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    // Adjusted registerForm initialization
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: this.passwordControl2,
      confirmPassword: this.passwordControl3,
      role: ['USER', Validators.required]
    }, { validators: this.passwordMatchValidator });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  passwordPattern = '^(?=.*[a-z])(?!.* ).{8,20}$';
  
    passwordControl2 = new FormControl('', [Validators.pattern(this.passwordPattern)]);
    passwordControl3 = new FormControl('', [Validators.pattern(this.passwordPattern)]);
  //delete employeeData and ID from localStorage if they were already set
  //whenever the login page is loaded
  private passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  get passwordMismatchError(): boolean {
    return this.registerForm.errors?.['passwordMismatch'] && this.registerForm.get('confirmPassword')?.touched;
  }
  onSubmit1() {
    this.isAPILoading = true;
    const email = this.forgotPasswordForm.get('email')?.value;
    fetch('https://events-system-back.wn.r.appspot.com/api/reset/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => {
      if (response.ok) {
        this.isAPILoading = false;
        this.showemailsuccessToast = true;
      } else {
        this.showemailfailToast = true;
        this.isAPILoading = false;
        setTimeout(() => {
          this.showemailfailToast = false;
        }, 10000);

      }
  })
    .catch(error => {
      this.showemailfailToast = true;
      this.isAPILoading = false;
      setTimeout(() => {
        this.showemailfailToast = false;
      }, 10000);

    });
  }
  ngOnInit() {
    localStorage.removeItem('employeeData');
    localStorage.removeItem('ID');
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.hidePassword ? 'password' : 'text';
  }
  togglePasswordVisibility1(): void {
    this.hidePassword1 = !this.hidePassword1;
    const passwordInput = document.getElementById('password1') as HTMLInputElement;
    passwordInput.type = this.hidePassword1 ? 'password' : 'text';
  }
  togglePasswordVisibility2(): void {
    this.hidePassword2 = !this.hidePassword2;
    const passwordInput = document.getElementById('password2') as HTMLInputElement;
    passwordInput.type = this.hidePassword2 ? 'password' : 'text';
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
        document.cookie = `refresh=${authData.refresh_token}; path=/; expires=` + new Date(new Date().getTime() + 24* 60 * 60 * 1000).toUTCString();

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
        }, 5000);
        console.error('Error during login:', error);
        this.errorMessage = 'Invalid credentials. Please try again.'; // Set error message for invalid credentials
        window.location.reload();
      }
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }
}