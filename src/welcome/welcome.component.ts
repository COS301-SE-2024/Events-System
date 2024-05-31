import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherAirplay } from '@ng-icons/feather-icons';
import { heroUsers } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIconComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
  viewProviders: [provideIcons({ featherAirplay, heroUsers })]
})

export class WelcomeComponent {}