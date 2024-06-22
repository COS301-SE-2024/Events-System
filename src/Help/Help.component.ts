import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Help.component.html',
  styleUrl: './Help.component.css',
})
export class HelpComponent {
  activeSection = 'gettingStarted'; // Default active section

  // Function to change the active section
  setActiveSection(section: string) {
    this.activeSection = section;
  }
}
