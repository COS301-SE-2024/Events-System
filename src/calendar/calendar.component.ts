import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-calendar',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './calendar.component.html',
//   styleUrl: './calendar.component.css',
// })
// export class CalendarComponent {}

// import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@Component({
    selector: 'calendar-inline-demo',
    templateUrl: './calendar.component.html',
    standalone: true,
    imports: [FormsModule, CalendarModule]
})
export class CalendarInlineDemo {
    date: Date[] | undefined;
}



