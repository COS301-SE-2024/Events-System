import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomHeaderService } from 'src/app/random-header.service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-seriescentercard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './seriescentercard.component.html',
  styleUrl: './seriescentercard.component.css',
})
export class SeriescentercardComponent implements OnInit{
  @Input() seriesId: string | undefined;
  @Input() name: string | undefined;
  imageSource: string;
  constructor(private randomImageService: RandomHeaderService) {
    this.imageSource = '';
  }


  ngOnInit(): void {
    // Use the injected service
    this.imageSource = this.randomImageService.getRandomHeaderSource();
  }
}
