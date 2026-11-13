import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonRouterLinkWithHref,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth.service';
import { DemoDataService } from '../../services/demo-data.service';
import { AvatarComponent } from '../../shared/avatar.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonContent,
    IonIcon,
    IonButton,
    IonRouterLinkWithHref,
    AvatarComponent,
  ],
})
export class ProfilePage {
  private readonly auth = inject(AuthService);
  private readonly nav = inject(NavController);
  private readonly data = inject(DemoDataService);

  protected readonly parent = this.data.parent;
  protected readonly children = this.data.children;

  protected logout(): void {
    this.auth.logout();
    this.nav.navigateRoot('/connexion');
  }
}
