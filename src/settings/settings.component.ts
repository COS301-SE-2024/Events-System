import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
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
    if (input.files && input.files.length) {
      this.avatar = input.files[0];
      // Handle avatar file upload logic here
      console.log(this.avatar);
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