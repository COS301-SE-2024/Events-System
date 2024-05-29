import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginsComponent } from '../Components/logins/logins.component';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginsComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {}
