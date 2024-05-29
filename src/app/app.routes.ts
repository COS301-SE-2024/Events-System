import { Route } from '@angular/router';
import { LoginComponent } from 'src/login/login.component';
import { SettingsComponent } from 'src/settings/settings.component';
import { HomeComponent } from 'src/home/home.component';
import { WelcomeComponent } from 'src/welcome/welcome.component';
import { AppComponent } from './app.component';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent }, // Home page
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'welcome', component: WelcomeComponent },
  // { path: 'home', component: SettingsComponent },
];