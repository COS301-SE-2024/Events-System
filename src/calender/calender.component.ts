import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.css',
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
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
  }


  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
  }


}
