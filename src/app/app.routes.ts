import { Route } from '@angular/router';
import { LoginComponent } from 'src/login/login.component';
import { SettingsComponent } from 'src/settings/settings.component';
import { HomeComponent } from 'src/home/home.component';
import { ProfileComponent } from 'src/profile/profile.component';
import { AppComponent } from './app.component';
import { CalenderComponent } from 'src/calender/calender.component';
import { EventsComponent } from 'src/events/events.component';
import { EventComponent } from 'src/event/event.component';
import { MyEventsComponent } from 'src/MyEvents/MyEvents.component';
import { CreateEventComponent } from 'src/CreateEvent/CreateEvent.component';
import { UpdateEventComponent } from 'src/UpdateEvent/UpdateEvent.component';
import { DeleteEventComponent } from 'src/DeleteEvent/DeleteEvent.component';
import { HelpComponent } from 'src/Help/Help.component';
import { SocialClubComponent } from 'src/socialClub/socialClub.component';
import { NotificationsComponent } from 'src/notifications/notifications.component';
import { NotifPopupComponent } from 'src/notif-popup/notif-popup.component';
import { SeriesCenterComponent } from 'src/seriesCenter/seriesCenter.component';
import { MyseriesComponent } from 'src/myseries/myseries.component';
import { CreateSeriesComponent } from 'src/CreateSeries/CreateSeries.component';
import { UpdateSeriesComponent } from 'src/UpdateSeries/UpdateSeries.component';
import { DeleteSeriesComponent } from 'src/DeleteSeries/DeleteSeries.component';
import { SeriesComponent } from 'src/series/series.component';
export const appRoutes: Route[] = [
  { path: '', component: HomeComponent }, // Home page
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'calender', component: CalenderComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'events', component: EventsComponent },
  { path: 'event/:id', component: EventComponent },
  { path: 'myevents', component: MyEventsComponent },
  { path: 'createevent', component: CreateEventComponent },
  { path: 'updateevent/:id', component: UpdateEventComponent },
  { path: 'deleteevent/:id', component: DeleteEventComponent },
  { path: 'socialclub/:id', component: SocialClubComponent},
  { path: 'help', component: HelpComponent},
  { path: 'notifications', component: NotificationsComponent},
  { path: 'notif-popup', component: NotifPopupComponent}
  { path: 'seriescenter', component: SeriesCenterComponent},
  { path: 'myseries', component: MyseriesComponent},
  { path: 'updateseries/:id', component: UpdateSeriesComponent },
  { path: 'deleteseries/:id', component: DeleteSeriesComponent },
  { path: 'createseries', component: CreateSeriesComponent },
  { path: 'series/:id', component: SeriesComponent },
  // { path: 'home', component: SettingsComponent },
];