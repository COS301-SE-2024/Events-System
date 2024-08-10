import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timestamp } from 'rxjs';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-user-review-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './userReviewCard.component.html',
  styleUrl: './userReviewCard.component.css',
})
export class UserReviewCardComponent {
  isAPILoading = false;
  showdeletesuccessToast = false;
  showdeletefailToast = false;
  showupdatesuccessToast = false;
  showupdatefailToast = false;
  rating1 = 0;
  comments1 = '';
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
  matchingIDs(): boolean {
    return Number(this.employeeId) === Number(localStorage.getItem('ID'));
  }





  deleteComment(reviewIds: string | undefined): void {
    this.isAPILoading = true;
    if (!reviewIds) return;
    console.log(reviewIds);
    // Implement your logic to delete the comment
    fetch(`https://events-system-back.wn.r.appspot.com/api/feedback/${reviewIds}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status === 204) {
          // No content to parse, handle success
          this.showdeletesuccessToast = true;
          this.isAPILoading = false;
          sessionStorage.clear();
          // Hide the toast after 5 seconds
          setTimeout(() => {
            this.showdeletesuccessToast = false;
          }, 5000);
          return; // Ensure a return value
      } else {
          return response.json().then(data => {
              // Handle other success responses if needed
              return data; // Ensure a return value
          });
      }
  })
  .catch((error) => {
    this.showdeletefailToast = true;
    this.isAPILoading = false;
  setTimeout(() => {
      this.showdeletefailToast = false;
    }, 10000);
    console.error('Error:', error);
  });
}
updateFeedback(): void {
  this.isAPILoading = true;
  console.log('Rating:', this.rating1);
  console.log('Review:', this.comments1);
  console.log('Review ID:', this.reviewId);

  const review = {
    rating: this.rating,
    comments: this.comments,
  };
  // Implement your logic to handle the form submission
  fetch('https://events-system-back.wn.r.appspot.com/api/feedback/' + this.reviewId, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(review)
  })
  .then(response => response.json())
  .then(data => {
      // Show the success toast
      this.showupdatesuccessToast = true;
      this.isAPILoading = false;
      sessionStorage.clear();
      // Hide the toast after 5 seconds
      setTimeout(() => {
        this.showupdatesuccessToast = false;
      }, 5000);
})
  .catch((error) => {
    this.showupdatefailToast = true;
    this.isAPILoading = false;


    setTimeout(() => {
      this.showupdatefailToast = false;
    }, 10000);
    console.error('Error:', error);
  });
}


closeDialog() {
  // Logic to close the dialog
  const dialog: any = document.querySelector('dialog');
  if (dialog) {
    dialog.close();
  }
}
}
