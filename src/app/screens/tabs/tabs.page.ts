import { Component, inject, signal } from '@angular/core';
import {
  IonBadge,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';

import { DemoDataService } from '../../services/demo-data.service';

/** Bottom navigation: Accueil, Enfants, Notifications, Profil. */
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrl: './tabs.page.scss',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge],
})
export class TabsPage {
  protected readonly unreadCount = inject(DemoDataService).unreadCount;
  protected readonly selected = signal('accueil');
}
