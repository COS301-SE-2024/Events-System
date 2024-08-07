import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timestamp } from 'rxjs';

@Component({
  selector: 'app-user-review-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userReviewCard.component.html',
  styleUrl: './userReviewCard.component.css',
})
export class UserReviewCardComponent {
  @Input() employeeId: string | undefined;
  @Input() firstName: string | undefined;
  @Input() lastName: string | undefined;
  @Input() comments: string | undefined;
  @Input() rating: number | undefined;
  @Input() createdAt: Date | undefined;

  // Helper to create an array for the rating stars
  getStars(): number[] {
    return Array(5).fill(0).map((x, i) => i + 1);
  }
}
