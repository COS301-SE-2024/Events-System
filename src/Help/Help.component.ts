import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Help.component.html',
  styleUrl: './Help.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms', style({ opacity: 1 }))
      ])
    ])]
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
