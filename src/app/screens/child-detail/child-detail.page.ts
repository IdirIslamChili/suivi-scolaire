import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from '@ionic/angular/standalone';

import { DemoDataService } from '../../services/demo-data.service';
import { AvatarComponent } from '../../shared/avatar.component';
import { AbsencesTabComponent } from './absences-tab.component';
import { NotesTabComponent } from './notes-tab.component';
import { PaymentsTabComponent } from './payments-tab.component';

const TABS = ['notes', 'absences', 'paiements'] as const;
type DetailTab = (typeof TABS)[number];

/** One child, with three tabs: Notes, Absences, Paiements. */
@Component({
  selector: 'app-child-detail',
  templateUrl: './child-detail.page.html',
  styleUrl: './child-detail.page.scss',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonContent,
    AvatarComponent,
    NotesTabComponent,
    AbsencesTabComponent,
    PaymentsTabComponent,
  ],
})
export class ChildDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly data = inject(DemoDataService);

  protected readonly child = this.data.getChild(Number(this.route.snapshot.paramMap.get('id')));
  protected readonly tab = signal<DetailTab>('notes');

  constructor() {
    // Alerts and notifications open a given tab with "?onglet=absences".
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const requested = params.get('onglet');
      this.tab.set(isDetailTab(requested) ? requested : 'notes');
    });
  }

  protected onTabChange(event: CustomEvent): void {
    const value = event.detail.value;
    if (isDetailTab(value)) {
      this.tab.set(value);
    }
  }
}

function isDetailTab(value: unknown): value is DetailTab {
  return TABS.includes(value as DetailTab);
}
