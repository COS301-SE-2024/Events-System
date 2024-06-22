import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
  makeContactInfoPublic: boolean = false;
  makeScreenerPublic: boolean = false;
  avatar: File | null = null;

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
      console.log(this.employeeData);
    } else {
      // Handle case where employeeData is not available in localStorage
    }
  }

  saveChanges() {
    // Save changes logic here
    console.log('Changes saved', {
      name: this.name,
      surname: this.surname,
      description: this.description,
      email: this.email,
      x: this.x,
      linkedIn: this.linkedIn,
      gitHub: this.gitHub,
      makeContactInfoPublic: this.makeContactInfoPublic,
      makeScreenerPublic: this.makeScreenerPublic,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    });
  }

  deleteAccount() {
    // Delete account logic here
    console.log('Account deleted');
  }
}