import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './PrivacyPolicy.component.html',
  styleUrl: './PrivacyPolicy.component.css',
})
export class PrivacyPolicyComponent {
  goBack(): void {
    window.history.back();
  }
}