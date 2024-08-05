import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-myseriescard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './myseriescard.component.html',
  styleUrl: './myseriescard.component.css',
})
export class MyseriescardComponent {
  @Input() seriesId: string | undefined;
  @Input() name: string | undefined;

}
