import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splashscreen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Splashscreen.component.html',
  styleUrl: './Splashscreen.component.css',
})
export class SplashscreenComponent implements OnInit {
  windowWidth= '';
  showSplash = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.windowWidth = "-" + window.innerWidth + "px";

      setTimeout(() => {
        this.showSplash = !this.showSplash;
      }, 1000);
    }, 6000);
  }

  hideSplashScreen() {
    this.showSplash = !this.showSplash;
  }
}
