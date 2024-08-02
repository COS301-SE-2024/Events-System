import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-oauth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oauth.component.html',
  styleUrl: './oauth.component.css',
})
export class OauthComponent implements OnInit{
  constructor(private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        console.log('Authorization code:', code);
        } else {
        console.error('Authorization code not found in the URL');
      }
    });
  }
}
