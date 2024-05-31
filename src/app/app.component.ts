import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from 'src/welcome/welcome.component';

@Component({
  standalone: true,
  imports: [RouterModule, WelcomeComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.Emulated
})
export class AppComponent {
  title = 'Events-System';
  isDrawerThin = false;

  toggleDrawer() {
    this.isDrawerThin = !this.isDrawerThin;
  }
}
