import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-search-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './searchProfile.component.html',
  styleUrl: './searchProfile.component.css',
})
export class SearchProfileComponent implements OnInit {
  selectedTab = 'about';
  employeeData: any; // Define employeeData property
  constructor(private route: ActivatedRoute) {}
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
    const storedEmployeeData = params['id'];

    fetch(`https://events-system-back.wn.r.appspot.com/api/employees/${storedEmployeeData}`)
    .then(response => response.json())
    .then(data => {
      this.employeeData = data;
    })
    .catch(error => {
      console.error('Error fetching employee data:', error);
    });
  }
    )}
}
