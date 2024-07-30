import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-notif-popup',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notif-popup.component.html',
  styleUrls: ['./notif-popup.component.css'],
})
export class NotifPopupComponent implements OnInit {
  notifications = [
    { id: 1, title: 'Notification Title 1', read: false },
    { id: 2, title: 'Notification Title 2', read: false },
    { id: 3, title: 'Notification Title 3', read: false },
  ];

  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {}


  navigateAndClosePopup(): void {
    this.router.navigate(['/notifications']);
    this.closePopup.emit();
  }
}
