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
    if(this.getCookie('jwt') || this.getCookie('refresh')) {
      this.logout();
    }
    
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
      .then(async data => {
        this.showregistersuccessToast = true;
        this.isAPILoading = false;
        // console.log('Registration successful:', data);

        // Get employee ID using access token
        const idResponse = await fetch('https://events-system-back.wn.r.appspot.com/api/v1/auth/' + data.access_token, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const idData = await idResponse.json();

        // Store employee ID in local storage
        localStorage.setItem('ID', idData);
        localStorage.setItem('googleSignIn', "true");
        document.cookie = `jwt=${data.access_token}; path=/; expires=` + new Date(new Date().getTime() + 15 * 60 * 1000).toUTCString();
        document.cookie = `refresh=${data.refresh_token}; path=/; expires=` + new Date(new Date().getTime() + 24* 60 * 60 * 1000).toUTCString();


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
      });
    } else {
      window.location.reload();
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
          } else {
            window.location.reload();
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
        }, 5000);
        // window.location.reload();
      }
    } else {
      // window.location.reload();
    }
  }

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

    if(!localStorage.getItem('ID') || !localStorage.getItem('googleRefresh')) {
      fullUrl = `${baseUrl}?${responseType}&${clientId}&${scope}&${redirectUri}&${service}&${o2v}&${ddm}&${flowName}&${accessType}`;
    }
    else {
      fullUrl = `${baseUrl}?${responseType}&${clientId}&${scope}&${redirectUri}&${service}&${o2v}&${ddm}&${flowName}`;
    }

    window.location.href = fullUrl;
  }

  logout() {
    this.checkCookies();

    fetch('https://events-system-back.wn.r.appspot.com/api/v1/auth/logout', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + this.getCookie('jwt'), // Ensure the token is passed
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
      if (response.ok) {
          // Successfully logged out
          localStorage.removeItem('ID');
          document.cookie = `jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          window.location.href = '/login'; // Redirect to login page or show logout success message
      }
      else {
        window.location.href = '/login';
      }
    })
    .catch(() => {
        window.location.reload();
    });
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
}