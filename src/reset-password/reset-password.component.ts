import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, ValidationErrors,  FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { SanitizePipe } from 'src/app/sanitization.pipe';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit{
  token = '';
  registerForm: FormGroup;
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@&*$#!.%])[a-zA-Z\d@&*$#!.%]{8,}$/;
  passwordControl2 = new FormControl('', [Validators.pattern(this.passwordPattern)]);
  passwordControl3 = new FormControl('', [Validators.pattern(this.passwordPattern)]);
  hidePassword = true;
  hidePassword1 = true;
  hidePassword2 = true;
  isAPILoading = false;
  showresetsuccessToast = false;
  showresetfailToast = false;
  sanitizePipe: SanitizePipe;
  constructor(private route: ActivatedRoute,
    private fb: FormBuilder, private router: Router, private sanitizer: DomSanitizer) {
      this.sanitizePipe = new SanitizePipe(this.sanitizer);

    this.registerForm = this.fb.group({
      password: this.passwordControl2,
      confirmPassword: this.passwordControl3,
    }, { validators: this.passwordMatchValidator });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const tokenParam = params.get('token') || '';
      this.token = tokenParam.split('=')[1] || '';
      console.log(this.token);
    });
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
  private passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  get passwordMismatchError(): boolean {
    return this.registerForm.errors?.['passwordMismatch'] && this.registerForm.get('confirmPassword')?.touched;
  }

  onChange(event: Event) {
    this.isAPILoading = true;
    event.preventDefault();

    if (this.registerForm.valid) {
      const password = this.sanitizePipe.transform(this.registerForm.get('password')?.value);

      fetch('https://events-system-back.wn.r.appspot.com/api/reset/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: this.token, password: password })
      })
      .then(response => {
        if (response.ok) {
          this.isAPILoading = false;
          this.showresetsuccessToast = true;
          setTimeout(() => {
            this.showresetsuccessToast = false;
            this.router.navigate(['/login']);
          }, 5000);
        } else {
          this.showresetfailToast = true;
          this.isAPILoading = false;
          setTimeout(() => {
            this.showresetfailToast = false;
          }, 10000);
  
        }
    })
      .catch(error => {
        this.showresetfailToast = true;
        this.isAPILoading = false;
        setTimeout(() => {
          this.showresetfailToast = false;
        }, 10000);
  
      });
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }

  hasMinLength(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password && password.length >= 8;
  }

  hasUppercase(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password && /[A-Z]/.test(password);
  }

  hasLowercase(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password && /[a-z]/.test(password);
  }

  hasSymbol(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password && /[%@*$!#&]/.test(password);
  }
  isFormValid(): boolean {
    return this.registerForm.valid && !this.passwordMismatchError;
  }
  
  
}
