import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomImageServiceService } from 'src/app/random-image-service.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-myschedule-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './MyscheduleCard.component.html',
  styleUrl: './MyscheduleCard.component.css',
  animations: [
    trigger('dropdownAnimation', [
      state('closed', style({
        height: '0px',
        overflow: 'hidden',
        padding: '0'
      })),
      state('open', style({
        height: '*',
        padding: '*'
      })),
      transition('closed <=> open', [
        animate('0.2s ease-in-out')
      ])
    ]),
    trigger('chevronAnimation', [
      state('down', style({
        transform: 'rotate(0deg)'
      })),
      state('up', style({
        transform: 'rotate(180deg)'
      })),
      transition('down <=> up', [
        animate('0.2s ease-in-out')
      ])
    ])
  ]
})
export class MyscheduleCardComponent implements OnInit{
  imageSource = "";
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  constructor(private randomImageService: RandomImageServiceService) { }
  ngOnInit(): void {
    this.imageSource = this.randomImageService.getRandomImageSource();
  }
  @Input() eventID: any | undefined;
  @Input() eventTitle: any | undefined;
  @Input() eventDescription: any | undefined;
  @Input() eventStartTime: any | undefined;
  @Input() eventEndTime: any | undefined;
  @Input() eventStartDate: any | undefined;
  @Input() eventEndDate: any | undefined;
  @Input() eventLocation: any | undefined;
  @Input() eventHostId: any | undefined;
  @Input() eventSocialClub: any | undefined;
  @Input() eventHost: any | undefined;
  @Input() eventAgenda: any | undefined;
  @Input() eventPreperationDetails: any | undefined;
  @Input() eventDietaryAccommodations: any | undefined;
  @Input() eventTags: any | undefined

  getFormattedDate(dateString: string): { day: string, month: string, weekday: string } {
    const date = new Date(dateString);
    const day = date.getDate().toString();
    const month = date.toLocaleString('default', { month: 'short' });
    const weekday = date.toLocaleString('default', { weekday: 'short' });
    return { day, month, weekday };
  }

  getFormattedTime(timeString: string): string {
    return timeString.slice(0, 5);
  }

  isToday(dateString: string): boolean {
    const today = new Date();
    const date = new Date(dateString);
    return today.toDateString() === date.toDateString();
  }
  isDietaryAccommodationSelected(accommodation: string): boolean {
    return this.eventDietaryAccommodations?.includes(accommodation);
  }
}