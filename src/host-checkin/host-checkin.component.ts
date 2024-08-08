import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-host-checkin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './host-checkin.component.html',
  styleUrls: ['./host-checkin.component.css'],
})

export class HostCheckinComponent implements OnInit {
  rsvpedEmployees: Array<{ name: string, surname: string, email: string }> = [];

  constructor() {}

  ngOnInit(): void {
    // Simulated data
    this.rsvpedEmployees = [
      { name: 'John', surname: 'Doe', email: 'john.doe@example.com' },
      { name: 'Jane', surname: 'Smith', email: 'jane.smith@example.com' },
      { name: 'Alice', surname: 'Johnson', email: 'alice.johnson@example.com' }
    ];
  }

  removeEmployee(index: number): void {
    this.rsvpedEmployees.splice(index, 1);
  }
}