import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeriescentercardComponent } from 'src/Components/seriescentercard/seriescentercard.component';

@Component({
  selector: 'app-series-center',
  standalone: true,
  imports: [CommonModule, SeriesCenterComponent, SeriescentercardComponent],
  templateUrl: './seriesCenter.component.html',
  styleUrl: './seriesCenter.component.css',
})
export class SeriesCenterComponent {
isLoading: any;
}
