import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RandomHeaderService } from '../app/random-header.service';

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './series.component.html',
  styleUrl: './series.component.css',
})
export class SeriesComponent implements OnInit{
  imageSource: string;
  isLoading = true;
  clubId= '';
  club: any = null;
  activeTab = 'tab1';
  goBack(): void {
    window.history.back();
  }
  constructor(private route: ActivatedRoute, private randomHeaderService: RandomHeaderService) { 
    this.imageSource = '';
  }
  ngOnInit(): void {
    this.imageSource = this.randomHeaderService.getRandomHeaderSource();
    this.route.params.subscribe(params => {
      this.clubId = params['id'];
      fetch('https://events-system-back.wn.r.appspot.com/api/socialclubs/' + this.clubId)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.club = data;
        this.isLoading = false;

      });
  });
}
}
