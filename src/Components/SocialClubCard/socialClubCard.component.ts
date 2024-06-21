import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-social-club-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './socialClubCard.component.html',
  styleUrl: './socialClubCard.component.css',
})
export class SocialClubCardComponent {
  @Input() socialClubName: string | undefined;
  @Input() socialClubCreator: string | undefined;
  @Input() socialClubID: string | undefined;
}
