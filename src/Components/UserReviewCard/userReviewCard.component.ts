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
  @Input() reviewId: string | undefined;
  @Input() firstName: string | undefined;
  @Input() lastName: string | undefined;
  @Input() comments: string | undefined;
  @Input() rating: number | undefined;
  @Input() createdAt: Date | undefined;
  @Input() pictureLink: string | undefined;

  // Helper to create an array for the rating stars
  getStars(): number[] {
    return Array(5).fill(0).map((x, i) => i + 1);
  }

  getInitials(): string {
    const firstInitial = this.firstName ? this.firstName.charAt(0) : '';
    const lastInitial = this.lastName ? this.lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

}
