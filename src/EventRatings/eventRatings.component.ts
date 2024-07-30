import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {UserReviewCardComponent} from 'src/Components/UserReviewCard/userReviewCard.component';

@Component({
  selector: 'app-event-ratings',
  standalone: true,
  imports: [CommonModule, UserReviewCardComponent, RouterModule],
  templateUrl: './eventRatings.component.html',
  styleUrl: './eventRatings.component.css',
})
export class EventRatingsComponent {}
