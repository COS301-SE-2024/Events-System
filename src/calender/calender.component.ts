import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalenderEventButtonComponent} from "src/Components/Calender-Event-Button/Calender-Event-button.component";

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [CommonModule, CalenderEventButtonComponent],
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
})
export class CalenderComponent {
  currentDate = new Date();


  getDaysInMonth() {
    const daysInMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
    const days = Array.from({length: daysInMonth}, (_, i) => i + 1);
    const weeks = [];
    while(days.length) {
      weeks.push(days.splice(0, 7));
    }
    return weeks;
  }


  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
  }


  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
  }
  getCalendarHTML() {
    const weeks = this.getDaysInMonth();
    let html = '<table><thead><tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr></thead><tbody>';
  
  
    for (const week of weeks) {
      html += '<tr>';
      for (const day of week) {
        html += `<td>${day || ''}</td>`;
      }
      html += '</tr>';
    }
  
  
    html += '</tbody></table>';
  
  
    return html;
  }
  
}
