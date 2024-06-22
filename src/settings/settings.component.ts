import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  employeeData: any; // Define employeeData property
  selectedTab: string = 'details';
  name: string = '';
  surname: string = '';
  description: string = '';
  email: string = '';
  x: string = '';
  linkedIn: string = '';
  gitHub: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  employeePictureLink: string = '';
  makeContactInfoPublic: boolean = false;
  makeScreenerPublic: boolean = false;
  avatar: File | null = null;
  

  constructor(private http: HttpClient, private router : Router ) {}
  
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.employeeData.employeePictureLink = e.target.result;
        // Optionally, upload the new image to the server here
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit(): void {
    const storedEmployeeData = localStorage.getItem('employeeData');
    if (storedEmployeeData) {
      this.employeeData = JSON.parse(storedEmployeeData);
    } else {
      // Handle case where employeeData is not available in localStorage
    }
  }

  saveChanges() {
    const updatedData: any = {};

    if (this.name) updatedData.firstName = this.name;
    if (this.surname) updatedData.lastName = this.surname;
    if (this.description) updatedData.employeeDescription = this.description;
    if (this.email) updatedData.email = this.email;
    if (this.x) updatedData.twitter = this.x;
    if (this.linkedIn) updatedData.linkedin = this.linkedIn;
    if (this.gitHub) updatedData.github = this.gitHub;
    if (this.employeePictureLink) updatedData.employeePictureLink = this.employeePictureLink;

    // Only send the new password if it matches the confirm password and is not empty
    if (this.newPassword && this.newPassword === this.confirmPassword) {
      updatedData.password = this.newPassword;
    }

    const id = localStorage.getItem('ID');

    console.log('ID', id)
    console.log('Changes saved', updatedData);


    this.http.patch(`https://events-system-back.wn.r.appspot.com/api/employees/${id}`, updatedData)
      .pipe(
        tap((response: any) => {
          console.log('Changes saved', response);
          // Optionally update the local storage with the new data
          const newEmployeeData = { ...this.employeeData, ...updatedData };
          localStorage.setItem('employeeData', JSON.stringify(newEmployeeData));
          this.employeeData = newEmployeeData;
        }),
        catchError((error: any) => {
          console.error('Error saving changes:', error);
          return of(null); // Return observable of null or handle error as needed
        })
      )
      .subscribe(() => {
        alert('Changes saved');
        //navigate to profile page
        this.router.navigate(['/profile']);
      });
  }

  deleteAccount() {
    // Delete account logic here
    console.log('Account deleted');
  }
}