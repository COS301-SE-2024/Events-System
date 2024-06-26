import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RandomHeaderService } from '../app/random-header.service';
@Component({
  selector: 'app-social-club',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './socialClub.component.html',
  styleUrl: './socialClub.component.css',
})
export class SocialClubComponent  implements OnInit{
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