import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchSocialClubCardComponent } from 'src/Components/SearchSocialClubCard/searchSocialClubCard.component';

@Component({
  selector: 'app-search-host-card',
  standalone: true,
  imports: [CommonModule, SearchSocialClubCardComponent],
  templateUrl: './searchHostCard.component.html',
  styleUrl: './searchHostCard.component.css',
})
export class SearchHostCardComponent {}
