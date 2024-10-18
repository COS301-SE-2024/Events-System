import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserReviewCardComponent } from 'src/Components/UserReviewCard/userReviewCard.component';
import { RandomHeaderService } from 'src/app/random-header.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { SanitizePipe } from 'src/app/sanitization.pipe';

@Component({
  selector: 'app-event-ratings',
  standalone: true,
  imports: [CommonModule, UserReviewCardComponent, RouterModule, FormsModule],
  templateUrl: './eventRatings.component.html',
  styleUrl: './eventRatings.component.css',
})
export class EventRatingsComponent implements OnInit {
  isLoading = true;
  eventId = '';
  imageSource: string;
  reviews: any[] = [];
  event: any;
  employees: any[] = [];
  isAPILoading = false;
  showsuccessToast = false;
  showfailToast = false;
  sanitizePipe: SanitizePipe;
  review = '';
  canWriteReview = false;
  eventRSVPs: any[] = [];
  isEventPassed = false;

  constructor(
    private router: Router,
    private randomheaderservice: RandomHeaderService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.sanitizePipe = new SanitizePipe(this.sanitizer);
    this.imageSource = '';
  }

  goBack(): void {
    window.history.back();
  }

  submitFeedback(): void {
    this.isAPILoading = true;
    console.log('Rating:', this.rating);
    console.log('Review:', this.review);

    const review = {
      eventId: Number(this.eventId),
      employeeId: Number(localStorage.getItem('ID')),
      rating: Number(this.rating),
      comments: this.sanitizePipe.transform(this.review),
    };

    fetch('https://events-system-back.wn.r.appspot.com/api/feedback', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    })
      .then((response) => response.json())
      .then((data) => {
        this.showsuccessToast = true;
        this.isAPILoading = false;
        sessionStorage.clear();
        setTimeout(() => {
          this.showsuccessToast = false;
        }, 5000);
      })
      .catch((error) => {
        this.showfailToast = true;
        this.isAPILoading = false;
        setTimeout(() => {
          this.showfailToast = false;
        }, 10000);
        console.error('Error:', error);
      });

    this.logUserAnalytics('submitted_feedback: ' + Number(this.eventId) + ' : ' + Number(this.rating));
  }

  closeDialog() {
    const dialog: any = document.querySelector('dialog');
    if (dialog) {
      dialog.close();
    }
  }

  rating = 0;

  ngOnInit(): void {
    this.imageSource = this.randomheaderservice.getRandomHeaderSource();
    this.checkCookies();
  
    this.route.params.subscribe((params) => {
      this.eventId = params['id'];
  
      const eventPromise = fetch('https://events-system-back.wn.r.appspot.com/api/events/' + this.eventId)
        .then((response) => response.json())
        .then((data) => {
          this.event = data;
          this.isEventPassed = new Date(this.event.endDate) < new Date(); // Check if the event has passed
        });
  
      const feedbackPromise = fetch('https://events-system-back.wn.r.appspot.com/api/feedback/event/' + this.eventId)
        .then((response) => response.json())
        .then((data) => {
          this.reviews = Array.isArray(data) ? data : [data];
          const employeePromises = this.reviews.map((review) =>
            fetch('https://events-system-back.wn.r.appspot.com/api/employees/' + review.employeeId, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((response) => response.json())
              .then((userData) => {
                review.firstName = userData.firstName;
                review.lastName = userData.lastName;
                review.employeePictureLink = userData.employeePictureLink;
                review.ratingId = review.feedbackId;
                this.employees.push(review);
              })
          );
          return Promise.all(employeePromises);
        });
  
      const rsvpPromise = this.fetchEventRSVPs();
  
      Promise.all([eventPromise, feedbackPromise, rsvpPromise])
        .then(() => {
          for (let i = 0; i < this.employees.length; ++i) {
            this.reviews[i].firstName = this.employees[i].firstName;
            this.reviews[i].lastName = this.employees[i].lastName;
          }
          this.checkUserRSVP();
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          this.reviews = [];
        })
        .finally(() => {
          this.isLoading = false;
        });
  
      this.logUserAnalytics('viewed_event_ratings: ' + this.eventId);
    });
  }

  getPercentage(stars: number): number {
    let count = 0;
    for (let i = 0; i < this.reviews.length; ++i) {
      if (this.reviews[i].rating == stars) {
        ++count;
      }
    }
    return count / this.reviews.length;
  }

  getAverageRating(): number {
    let sum = 0;
    for (let i = 0; i < this.reviews.length; ++i) {
      sum += this.reviews[i].rating;
    }
    const averageRating = sum / this.reviews.length;
    return isFinite(averageRating) ? averageRating : 0;
  }

  getStars(): number[] {
    return Array(5)
      .fill(0)
      .map((x, i) => i + 1);
  }

  async checkCookies() {
    const cookies = document.cookie.split('; ');
    let accessToken = null;
    let refreshToken = null;
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'jwt') {
        accessToken = decodeURIComponent(value);
        break;
      }
    }
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'refresh') {
        refreshToken = decodeURIComponent(value);
        break;
      }
    }

    if (!accessToken) {
      if (!refreshToken) {
        this.router.navigate(['/home']);
      }

      try {
        const response = await fetch('https://events-system-back.wn.r.appspot.com/api/v1/auth/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getCookie('refresh')}`,
          },
          body: JSON.stringify(FormData),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const authData = await response.json();
        document.cookie =
          `jwt=${authData.access_token}; path=/; expires=` +
          new Date(new Date().getTime() + 15 * 60 * 1000).toUTCString();
        document.cookie =
          `refresh=${authData.refresh_token}; path=/; expires=` +
          new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toUTCString();
        console.log('Token refresh successful');
      } catch (error) {
        console.error('Error refreshing token');
      }
    }
  }

  getCookie(cookieName: string) {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      const cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }

  async logUserAnalytics(action: string): Promise<void> {
    const userId = localStorage.getItem('ID');
    if (!userId) return;

    const requestBody = {
      userId: parseInt(userId),
      actionType: action,
    };

    try {
      const response = await fetch('https://events-system-back.wn.r.appspot.com/api/user-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to log user analytics');
      }

      console.log('User analytics logged successfully');
    } catch (error) {
      console.error('Error logging user analytics:', error);
    }
  }

  async fetchEventRSVPs(): Promise<void> {
    try {
      const response = await fetch(`https://events-system-back.wn.r.appspot.com/api/event-rsvps/event/${this.eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event RSVPs');
      }
      const rsvps = await response.json();
      this.eventRSVPs = rsvps;
    } catch (error) {
      console.error('Error fetching event RSVPs:', error);
    }
  }

  checkUserRSVP(): void {
    const userId = localStorage.getItem('ID');
    this.canWriteReview = this.eventRSVPs.some((rsvp) => Number(rsvp.employeeId) === Number(userId));
  }
}