import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SocialClubCardComponent} from 'src/Components/SocialClubCard/socialClubCard.component';

@Component({
  selector: 'app-social-clubs',
  standalone: true,
  imports: [CommonModule, SocialClubCardComponent],
  templateUrl: './SocialClubs.component.html',
  styleUrl: './SocialClubs.component.css',
})
export class SocialClubsComponent {}
