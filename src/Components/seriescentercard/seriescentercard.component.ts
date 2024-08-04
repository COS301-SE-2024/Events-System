import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomHeaderService } from 'src/app/random-header.service';
@Component({
  selector: 'app-seriescentercard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seriescentercard.component.html',
  styleUrl: './seriescentercard.component.css',
})
export class SeriescentercardComponent implements OnInit{
  imageSource: string;
  constructor(private randomImageService: RandomHeaderService) {
    this.imageSource = '';
  }
  ngOnInit(): void {
    // Use the injected service
    this.imageSource = this.randomImageService.getRandomHeaderSource();
  }
}
