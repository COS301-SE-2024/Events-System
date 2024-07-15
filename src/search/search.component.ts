import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SearchEventCardComponent} from 'src/Components/SearchEventCard/searchEventCard.component';
import {SearchHostCardComponent } from 'src/Components/searchHostCard/searchHostCard.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SearchEventCardComponent, SearchHostCardComponent, RouterModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})

export class SearchComponent {
  constructor(private router: Router) { }
  events: any[] = [];
  hosts: any[] = [];
  searchTerm = '';
  filteredEvents: any[] = [];
  filteredHosts: any[] = [];
  searchQuery = '';
  loading = true;

  ngOnInit(): void {
    const employeeId = Number(localStorage.getItem('ID'));

    if (!employeeId) {
      this.router.navigate(['/login']);
      return;
    }


    Promise.all([
      fetch('https://events-system-back.wn.r.appspot.com/api/events')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(text => {
          const data = text ? JSON.parse(text) : [];
          this.events = Array.isArray(data) ? data : [data];
        }),
      fetch('https://events-system-back.wn.r.appspot.com/api/employees')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(employees => {
          // const managers = employees; // if you want to show all users
          const managers = employees.filter((employee: any) => employee.role === "MANAGER");
          this.hosts = managers;
        })
    ]).then(() => {
      this.filterEvents();
      this.loading = false;
    }).catch(error => {
      console.error('Error:', error);
      this.loading = false;
    });
  }

  filterEvents() {
    this.filteredEvents = this.events.filter(event =>
      event.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredHosts = this.hosts.filter(host =>
      host.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      host.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      host.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  updateSearchTerm(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target?.value || '';
    this.filterByTitle();
  }

  filterByTitle() {
    this.filterEvents();
  }
}
