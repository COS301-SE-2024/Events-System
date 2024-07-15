import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchSocialClubCardComponent } from 'src/Components/SearchSocialClubCard/searchSocialClubCard.component';

@Component({
  selector: 'app-search-host-card',
  standalone: true,
  imports: [CommonModule, SearchSocialClubCardComponent],
  templateUrl: './searchHostCard.component.html',
  styleUrl: './searchHostCard.component.css',
})
export class SearchHostCardComponent {
  @Input() hostName: string | undefined;
  @Input() hostEmail: string | undefined;
  @Input() hostImage: string | undefined;

  getInitials(): string {
    if (!this.hostName) return ''; // Return empty string if hostName is undefined
    const names = this.hostName.split(' '); // Split the hostName into an array
    if (names.length < 2) return this.hostName.charAt(0).toUpperCase(); // Handle case with no last name
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase(); // Concatenate the first letter of the first and last name
  }
}
