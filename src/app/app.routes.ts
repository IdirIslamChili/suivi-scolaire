import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './guards/auth.guard';
import { ChildDetailPage } from './screens/child-detail/child-detail.page';
import { ChildrenPage } from './screens/children/children.page';
import { HomePage } from './screens/home/home.page';
import { LoginPage } from './screens/login/login.page';
import { NotificationsPage } from './screens/notifications/notifications.page';
import { ProfilePage } from './screens/profile/profile.page';
import { TabsPage } from './screens/tabs/tabs.page';

// Screens are imported eagerly (no lazy loading) on purpose: the app is small,
// and having everything in the first bundle guarantees it keeps working offline.
export const routes: Routes = [
  { path: 'connexion', component: LoginPage, canActivate: [guestGuard] },
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [authGuard],
    children: [
      { path: 'accueil', component: HomePage },
      { path: 'enfants', component: ChildrenPage },
      { path: 'enfants/:id', component: ChildDetailPage },
      { path: 'notifications', component: NotificationsPage },
      { path: 'profil', component: ProfilePage },
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'tabs/accueil', pathMatch: 'full' },
  { path: '**', redirectTo: 'tabs/accueil' },
];
