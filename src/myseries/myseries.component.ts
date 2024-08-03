import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyseriescardComponent } from 'src/Components/myseriescard/myseriescard.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myseries',
  standalone: true,
  imports: [CommonModule, MyseriescardComponent],
  templateUrl: './myseries.component.html',
  styleUrl: './myseries.component.css',
})
export class MyseriesComponent {

  constructor(private router: Router) {}


  navigateToCreateSeries() {
    this.router.navigate(['/createseries']);
  }
}
