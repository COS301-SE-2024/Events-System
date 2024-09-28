import { Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { RandomImageServiceService } from 'src/app/random-image-service.service';

@Component({
  selector: 'app-myseriescard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './myseriescard.component.html',
  styleUrl: './myseriescard.component.css',
})
export class MyseriescardComponent implements OnInit {
  @Input() seriesId: string | undefined;
  @Input() name: string | undefined;
  @Input() description: string | undefined;
  imageSource: string;
  constructor(private route: ActivatedRoute, private randomImageService: RandomImageServiceService) {
    this.imageSource = '';
  }
  ngOnInit(): void {
      this.imageSource = this.randomImageService.getRandomImageSource();
  }

}
