import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social-club-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './socialClubCard.component.html',
  styleUrl: './socialClubCard.component.css',
})
export class SocialClubCardComponent {
  @Input() socialClubName: string | undefined;
  @Input() socialClubCreator: string | undefined;
}
