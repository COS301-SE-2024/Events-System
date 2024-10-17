import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SearchEventCardComponent} from 'src/Components/SearchEventCard/searchEventCard.component';
import {SearchHostCardComponent } from 'src/Components/searchHostCard/searchHostCard.component';
import {SearchSocialClubCardComponent} from 'src/Components/SearchSocialClubCard/searchSocialClubCard.component';
import {GhostSearchEventCardComponent} from 'src/Components/GhostSearchEventCard/GhostSearchEventCard.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, SearchEventCardComponent, SearchHostCardComponent, RouterModule, FormsModule, SearchSocialClubCardComponent, GhostSearchEventCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})

export class SearchComponent {
  constructor(private router: Router, private route: ActivatedRoute) { }
  events: any[] = [];
  hosts: any[] = [];
  socialclubs: any[] = [];
  searchTerm = '';
  filteredEvents: any[] = [];
  filteredHosts: any[] = [];
  filteredSocialClubs: any[] = [];
  searchQuery = '';
  loading = true;

  showEvents = true;
  showHosts = true;
  showSocialClubs = true;
  goBack(): void {
    window.history.back();
  }
  ngOnInit(): void {
    
    const employeeId = Number(localStorage.getItem('ID'));

    if (!employeeId) {
      this.router.navigate(['/home']);
      return;
    }
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['tag'] || '';
      this.filterEvents();
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });

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
          const events = Array.isArray(data) ? data : [data];
          const currentDate = new Date();
          this.events = events.filter(event => {
            const eventEndDate = new Date(`${event.endDate}T${event.endTime}`);
            return eventEndDate >= currentDate;
          });
        }),
      fetch('https://events-system-back.wn.r.appspot.com/api/employees')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(employees => {
          const managers = employees.filter((employee: any) => employee.role === "MANAGER");
          this.hosts = managers;
        }),
      fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(socialclubs => {
          this.socialclubs = socialclubs;
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
      event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      event.tags.some((tag: string) => tag.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
    this.filteredHosts = this.hosts.filter(host =>
      host.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      host.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredSocialClubs = this.socialclubs.filter(club =>
      club.name.toLowerCase().includes(this.searchTerm.toLowerCase())
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

  onCheckboxChange(type: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;

    if (type === 'events') {
      this.showEvents = isChecked;
    } else if (type === 'hosts') {
      this.showHosts = isChecked;
    } else if (type === 'socialclubs') {
      this.showSocialClubs = isChecked;
    }
  }
}
