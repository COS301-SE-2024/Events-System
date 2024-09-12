import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ValidationErrors,  FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms'; 
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { RefreshService } from 'src/app/refresh.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SanitizePipe } from 'src/app/sanitization.pipe';

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
  googleClientId = environment.CLIENT_ID;
  sanitizePipe: SanitizePipe;
  redirectUri = 'https://events-system.org/oauth/callback'; // e.g., http://localhost:4200/oauth/callback
  googleAuthEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  responseType = 'code';
  scope = 'openid email profile';
  hidePassword1 = true;
  hidePassword2 = true;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private refreshService: RefreshService,
    private sanitizer: DomSanitizer
  ) {
    // Adjusted registerForm initialization

    //"Create an account" form validation
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[\w.]+@([\w-]+.)+[\w-]{2,4}$/)]], 
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[&*^%$#!"'.])[a-zA-Z\d&*^%$#!"'.]{8,}$/)]], 
      confirmPassword: ['', [Validators.required]],
      role: ['', Validators.required]}, 
    { validators: this.passwordMatchValidator()});

    //"Login" form validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[\w.]+@([\w-]+.)+[\w-]{2,4}$/)]], 
      password: ['', [Validators.required]] //Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[&*^%$#!"'.])[a-zA-Z\d&*^%$#!"'.]{8,}$/)
    });

    //"Forgot password" form validation
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[\w.]+@([\w-]+.)+[\w-]{2,4}$/)]]
    });

    this.sanitizePipe = new SanitizePipe(this.sanitizer);
  }
  passwordPattern = '^(?=.*[a-z])(?!.* ).{8,20}$';
  
  // passwordPattern = '^(?=.*[a-z])(?!.* ).{1,2}$';
  // passwordControl2 = new FormControl('', [Validators.pattern(this.passwordPattern)]);
  // passwordControl3 = new FormControl('');
  //delete employeeData and ID from localStorage if they were already set
  //whenever the login page is loaded
  // private passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
  //   const password = formGroup.get('password')?.value;
  //   const confirmPassword = formGroup.get('confirmPassword')?.value;
  //   return password === confirmPassword ? null : { passwordMismatch: true };
  // }

  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
  
      return password && confirmPassword && password !== confirmPassword
        ? { passwordMismatch: true }
        : null;
    };
  }

  //  get passwordMismatchError(): boolean {
  //    return this.registerForm.errors?.['passwordMismatch'] && this.registerForm.get('confirmPassword')?.touched;
  //  }

  onSubmit1() {
    this.isAPILoading = true;
    const email = this.sanitizePipe.transform(this.forgotPasswordForm.get('email')?.value);
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
        }, 6000);

      }
  })
    .catch(error => {
      this.showemailfailToast = true;
      this.isAPILoading = false;
      setTimeout(() => {
        this.showemailfailToast = false;
      }, 6000)
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
      firstName:  this.sanitizePipe.transform(this.registerForm.get('firstName')?.value),
      lastName:  this.sanitizePipe.transform(this.registerForm.get('lastName')?.value),
      email:  this.sanitizePipe.transform(this.registerForm.get('email')?.value),
      password:  this.sanitizePipe.transform(this.registerForm.get('password')?.value),
      role:  this.sanitizePipe.transform(this.registerForm.get('role')?.value)
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
        email:  this.sanitizePipe.transform(this.loginForm.get('email')?.value),
        password:  this.sanitizePipe.transform(this.loginForm.get('password')?.value)
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
          this.refreshService.triggerRefreshNavbar();
          this.router.navigate(['']);
        }, 5000);
        // Navigate to profile page

      } catch (error) {
        this.showloginfailToast = true;
        this.isAPILoading = false;
        setTimeout(() => {
          this.showloginfailToast = false;
        }, 6000);
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
      const baseUrl = 'https://accounts.google.com/o/oauth2/auth/oauthchooseaccount';
      const responseType = 'response_type=code';
      const clientId = 'client_id=' + environment.CLIENT_ID;
      const scope = 'scope=profile%20email';
      const redirectUri = 'redirect_uri=https%3A%2F%2Fevents-system.org%2Foauth';
      const service = 'service=lso';
      const o2v = 'o2v=1';
      const ddm = 'ddm=0';
      const flowName = 'flowName=GeneralOAuthFlow';
      const fullUrl = `${baseUrl}?${responseType}&${clientId}&${scope}&${redirectUri}&${service}&${o2v}&${ddm}&${flowName}`;

      console.log(decodeURIComponent(fullUrl));
      window.location.href = `${baseUrl}?${responseType}&${clientId}&${scope}&${redirectUri}&${service}&${o2v}&${ddm}&${flowName}`;

      
  }
}