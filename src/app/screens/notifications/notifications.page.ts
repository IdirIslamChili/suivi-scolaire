import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';

import { AppNotification, NotificationKind } from '../../models/school.models';
import { DemoDataService } from '../../services/demo-data.service';
import { addDays, dayOf } from '../../shared/date-utils';

interface NotificationGroup {
  day: string;
  /** "Aujourd’hui", "Hier", or empty when the date itself is shown. */
  label: string;
  items: AppNotification[];
}

const KIND_LABELS: Record<NotificationKind, string> = {
  homework: 'Devoir',
  test: 'Contrôle',
  payment: 'Paiement',
  absence: 'Absence',
};

const KIND_ICONS: Record<NotificationKind, string> = {
  homework: 'book-outline',
  test: 'create-outline',
  payment: 'wallet-outline',
  absence: 'alert-circle-outline',
};

/** The notifications received by the parent, most recent first. */
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrl: './notifications.page.scss',
  imports: [DatePipe, IonHeader, IonToolbar, IonContent, IonIcon],
})
export class NotificationsPage {
  private readonly data = inject(DemoDataService);
  private readonly nav = inject(NavController);

  protected readonly kindLabels = KIND_LABELS;
  protected readonly kindIcons = KIND_ICONS;
  protected readonly unreadCount = this.data.unreadCount;

  /** Notifications grouped by day. */
  protected readonly groups = computed<NotificationGroup[]>(() => {
    const groups: NotificationGroup[] = [];
    for (const notification of this.data.notifications()) {
      const day = dayOf(notification.sentAt);
      let group = groups.find((candidate) => candidate.day === day);
      if (!group) {
        group = { day, label: this.dayLabel(day), items: [] };
        groups.push(group);
      }
      group.items.push(notification);
    }
    return groups;
  });

  /** Marks the notification as read and opens the related screen, if any. */
  protected open(notification: AppNotification): void {
    this.data.markAsRead(notification.id);

    if (notification.kind === 'absence' && notification.childId) {
      this.nav.navigateForward(['/tabs/enfants', notification.childId], {
        queryParams: { onglet: 'absences' },
      });
    } else if (notification.kind === 'payment') {
      this.nav.navigateForward(
        notification.childId ? ['/tabs/enfants', notification.childId] : ['/tabs/enfants'],
        { queryParams: notification.childId ? { onglet: 'paiements' } : {} },
      );
    }
  }

  protected markAllAsRead(): void {
    this.data.markAllAsRead();
  }

  private dayLabel(day: string): string {
    if (day === this.data.today) {
      return 'Aujourd’hui';
    }
    return day === addDays(this.data.today, -1) ? 'Hier' : '';
  }
}
