import { DatePipe } from '@angular/common';
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
import { DzdPipe } from '../../shared/format.pipes';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  imports: [
    DatePipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonContent,
    IonIcon,
    IonRouterLinkWithHref,
    AvatarComponent,
    DzdPipe,
  ],
})
export class HomePage {
  protected readonly data = inject(DemoDataService);
  protected readonly parent = this.data.parent;

  /** One line per child, with what needs attention today. */
  protected readonly children = this.data.children.map((child) => ({
    child,
    absenceToday: this.data.getAbsenceToday(child.id),
    unpaidCount: this.data.getUnpaidPayments(child.id).length,
  }));

  protected readonly absentToday = this.children.filter((item) => item.absenceToday);
  /** "Lina · matinée, non justifiée" for one child, the first names otherwise. */
  protected readonly absenceDetail = this.describeAbsences();

  protected readonly due = this.data.getDueSummary();
  protected readonly firstUnpaidChild = this.children.find((item) => item.unpaidCount > 0)?.child;

  private describeAbsences(): string {
    const names = this.absentToday.map((item) => item.child.firstName).join(', ');
    const absence = this.absentToday.length === 1 ? this.absentToday[0].absenceToday : undefined;
    if (!absence) {
      return names;
    }
    const status = absence.justified ? 'justifiée' : 'non justifiée';
    return `${names} · ${absence.duration.toLowerCase()}, ${status}`;
  }
}
