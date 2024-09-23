import { Route } from '@angular/router';
import { LoginComponent } from 'src/login/login.component';
import { SettingsComponent } from 'src/settings/settings.component';
import { HomeComponent } from 'src/home/home.component';
import { ProfileComponent } from 'src/profile/profile.component';
import { CalenderComponent } from 'src/calender/calender.component';
import { EventsComponent } from 'src/events/events.component';
import { EventComponent } from 'src/event/event.component';
import { MyEventsComponent } from 'src/MyEvents/MyEvents.component';
import { CreateEventComponent } from 'src/CreateEvent/CreateEvent.component';
import { UpdateEventComponent } from 'src/UpdateEvent/UpdateEvent.component';
import { DeleteEventComponent } from 'src/DeleteEvent/DeleteEvent.component';
import { HelpComponent } from 'src/Help/Help.component';
import { SocialClubComponent } from 'src/socialClub/socialClub.component';
import { OauthComponent } from 'src/oauth/oauth.component';
import { HostCheckinComponent } from 'src/host-checkin/host-checkin.component';
import { SocialClubListingComponent } from 'src/SocialClubHubListing/socialClubListing.component';
import { SocialClubCreateComponent } from 'src/socialClubCreate/socialClubCreate.component';
import {UpdateSocialClubComponent} from 'src/UpdateSocialClub/updateSocialClub.component';
import {DeleteSocialClubComponent} from 'src/DeleteSocialClub/deleteSocialClub.component';
import {SocialClubsComponent} from 'src/SocialClubs/SocialClubs.component';
import { SearchComponent } from 'src/search/search.component';  
import { SearchProfileComponent } from 'src/searchProfile/searchProfile.component';
import { NotificationsComponent } from 'src/notifications/notifications.component';
import { NotifPopupComponent } from 'src/notif-popup/notif-popup.component';
import { SeriesCenterComponent } from 'src/seriesCenter/seriesCenter.component';
import { MyseriesComponent } from 'src/myseries/myseries.component';
import { MyScheduleComponent } from 'src/MySchedule/MySchedule.component';
import { CreateSeriesComponent } from 'src/CreateSeries/CreateSeries.component';
import { UpdateSeriesComponent } from 'src/UpdateSeries/UpdateSeries.component';
import { DeleteSeriesComponent } from 'src/DeleteSeries/DeleteSeries.component';
import { SeriesComponent } from 'src/series/series.component';
import { ResetPasswordComponent } from 'src/reset-password/reset-password.component';
import { MapComponent } from 'src/map/map.component';
import { EventRatingsComponent } from 'src/EventRatings/eventRatings.component';
import { AuthGuard } from './authguard.guard';
import { LeaderboardComponent } from 'src/Leaderboard/Leaderboard.component';

export const appRoutes: Route[] = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] }, // Home page
  { path: 'login', component: LoginComponent},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'calender', component: CalenderComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'events', component: EventsComponent, canActivate: [AuthGuard] },
  { path: 'event/:id', component: EventComponent, canActivate: [AuthGuard] },
  { path: 'myevents', component: MyEventsComponent, canActivate: [AuthGuard] },
  { path: 'createevent', component: CreateEventComponent, canActivate: [AuthGuard] },
  { path: 'updateevent/:id', component: UpdateEventComponent, canActivate: [AuthGuard] },
  { path: 'deleteevent/:id', component: DeleteEventComponent, canActivate: [AuthGuard] },
  { path: 'socialclub/:id', component: SocialClubComponent, canActivate: [AuthGuard] },
  { path: 'help', component: HelpComponent, canActivate: [AuthGuard] },
  { path: 'oauth', component: OauthComponent },
  { path: 'hostcheckin', component: HostCheckinComponent, canActivate: [AuthGuard] },
  { path: 'hostcheckin/:eventId', component: HostCheckinComponent, canActivate: [AuthGuard] },
  { path: 'socialclublisting', component: SocialClubListingComponent, canActivate: [AuthGuard] },
  { path: 'socialclubcreate', component: SocialClubCreateComponent, canActivate: [AuthGuard] },
  { path: 'updatesocialclub/:id', component: UpdateSocialClubComponent, canActivate: [AuthGuard] },
  { path: 'deletesocialclub/:id', component: DeleteSocialClubComponent, canActivate: [AuthGuard] },
  { path: 'socialclubs', component: SocialClubsComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'searchProfile/:id', component: SearchProfileComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'notif-popup', component: NotifPopupComponent, canActivate: [AuthGuard] },
  { path: 'seriescenter', component: SeriesCenterComponent, canActivate: [AuthGuard] },
  { path: 'myseries', component: MyseriesComponent, canActivate: [AuthGuard] },
  { path: 'myschedule', component: MyScheduleComponent, canActivate: [AuthGuard] },
  { path: 'updateseries/:id', component: UpdateSeriesComponent, canActivate: [AuthGuard] },
  { path: 'deleteseries/:id', component: DeleteSeriesComponent, canActivate: [AuthGuard] },
  { path: 'createseries', component: CreateSeriesComponent, canActivate: [AuthGuard] },
  { path: 'series/:id', component: SeriesComponent, canActivate: [AuthGuard] },
  { path: 'map', component: MapComponent, canActivate: [AuthGuard] },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'feedbackandratings/:id', component: EventRatingsComponent, canActivate: [AuthGuard] },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] }
];