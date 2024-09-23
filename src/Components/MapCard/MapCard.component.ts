import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RandomImageServiceService } from 'src/app/random-image-service.service';

@Component({
  selector: 'app-map-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './MapCard.component.html',
  styleUrls: ['./MapCard.component.css'],
})
export class MapCardComponent  {
  @Input() imageSource = "";
  @Input() title = '';
  @Input() description = '';
  @Input() eventID = '';
  @Input() startTime = '';
  @Input() endTime = '';
  @Input() startDate = '';
  @Input() endDate = '';
  private _preperationDetails: string[] = [];

  @Input()
  set PreperationDetails(value: string | string[]) {
    if (typeof value === 'string') {
      this._preperationDetails = value.split(',').map(item => item.trim());
    } else {
      this._preperationDetails = value;
    }
  }

  get PreperationDetails(): string[] {
    return this._preperationDetails;
  }


  closeCard(): void {
    const card = document.getElementById('info-card');
    if (card) {
      card.classList.remove('show');
    }
  }

  formatTime(time: string | undefined): string | undefined {
    if (time) {
      const parts = time.split(':');
      return parts[0] + ':' + parts[1];
    }
    return undefined;
  }
}