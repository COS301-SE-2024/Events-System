import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Help.component.html',
  styleUrls: ['./Help.component.css'],
})
export class HelpComponent {
  searchQuery = '';
  activeSection = 'faq'; // Default active section
  selectedSection = 'faq'; // Initialize selectedSection
  sections: any[] = [
    { id: 'faq', title: 'Frequently asked Questions' },
    { id: 'account', title: 'My account' },
    { id: 'login', title: 'Login page' },
    { id: 'home', title: 'Home Page' },
    { id: 'profile', title: 'Profile Page' },
    { id: 'events', title: 'Events Page' },
    { id: 'createevents', title: 'Creating Events' },
    { id: 'MySchedule', title: 'My Schedule Page' },
    { id: 'Settings', title: 'Settings Page' }
  ];
  filteredSections: any[] = [...this.sections];

  setActiveSection(section: string) {
    this.activeSection = section;
    this.selectedSection = section; // Ensure both activeSection and selectedSection are updated
  }

  filterSections() {
    this.filteredSections = this.sections.filter(section =>
      section.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}