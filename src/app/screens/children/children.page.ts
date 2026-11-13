import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonRouterLinkWithHref,
  IonToolbar,
} from '@ionic/angular/standalone';

import { DemoDataService } from '../../services/demo-data.service';
import { AvatarComponent } from '../../shared/avatar.component';
import { DzdPipe, GradePipe } from '../../shared/format.pipes';

@Component({
  selector: 'app-children',
  templateUrl: './children.page.html',
  styleUrl: './children.page.scss',
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonContent,
    IonIcon,
    IonRouterLinkWithHref,
    AvatarComponent,
    GradePipe,
    DzdPipe,
  ],
})
export class ChildrenPage {
  protected readonly data = inject(DemoDataService);

  /** Each child with the three key figures of the term. */
  protected readonly children = this.data.children.map((child) => ({
    child,
    average: this.data.getGeneralAverage(child.id),
    absenceCount: this.data.getAbsences(child.id).length,
    amountDue: this.data.getAmountDue(child.id),
  }));
}
