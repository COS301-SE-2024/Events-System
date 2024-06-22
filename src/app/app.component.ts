import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [RouterModule, BrowserModule, BrowserAnimationsModule],
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
