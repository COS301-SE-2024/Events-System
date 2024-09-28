import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyseriescardComponent } from 'src/Components/myseriescard/myseriescard.component';
import { Router } from '@angular/router';
import { GhostSocialClubCardComponent } from 'src/Components/GhostSocialClubCard/GhostSocialClubCard.component';
@Component({
  selector: 'app-myseries',
  standalone: true,
  imports: [CommonModule, MyseriescardComponent, GhostSocialClubCardComponent],
  templateUrl: './myseries.component.html',
  styleUrl: './myseries.component.css',
})
export class MyseriesComponent implements OnInit {
  isLoading = true;
  series: any[] =[];
  constructor(private router: Router) {}

  ngOnInit(): void {
    const employeeId = Number(localStorage.getItem('ID'));
    // console.log("https://events-system-back.wn.r.appspot.com/eventseries/host/" + employeeId);
    this.isLoading = true;
    fetch('https://events-system-back.wn.r.appspot.com/api/eventseries/host/' + employeeId)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.series = Array.isArray(data) ? data : [data];
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error:', error);
        this.isLoading = false;
      });
}
  navigateToCreateSeries() {
    this.router.navigate(['/createseries']);
  }
}
