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

  saveChanges(): void {
    console.log('Changes saved');
  }

  deleteAccount(): void {
    console.log('Account deleted');
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}