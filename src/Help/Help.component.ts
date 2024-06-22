import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Help.component.html',
  styleUrl: './Help.component.css',
})
export class HelpComponent {
  activeSection = 'gettingStarted'; // Default active section
  selectedSection = 'gettingStarted'; // Initialize selectedSection

  // Function to change the active section
  setActiveSection(section: string) {
    this.activeSection = section;
    this.selectedSection = section; // Ensure both activeSection and selectedSection are updated
    // Additional logic to handle section change
  }
}
