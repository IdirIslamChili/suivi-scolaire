import { Injectable, computed, signal } from '@angular/core';

import {
  Absence,
  AppNotification,
  Child,
  DueSummary,
  Parent,
  Payment,
  SubjectResult,
} from '../models/school.models';
import {
  ABSENCES,
  CHILDREN,
  DEMO_ACCOUNT,
  DEMO_TODAY,
  NOTIFICATIONS,
  PARENT,
  PAYMENTS,
  SCHOOL_YEAR,
  SUBJECTS,
  TERM_LABEL,
} from './demo-data';

/**
 * Single access point to the fake demo data. Everything is local, so the app
 * works offline. To plug in the real API later, replace the bodies of these
 * methods with HttpClient calls (see /backend) — the screens do not change.
 */
@Injectable({ providedIn: 'root' })
export class DemoDataService {
  readonly today = DEMO_TODAY;
  readonly schoolYear = SCHOOL_YEAR;
  readonly termLabel = TERM_LABEL;
  readonly demoAccount = DEMO_ACCOUNT;

  readonly parent: Parent = PARENT;
  readonly children: Child[] = CHILDREN.filter((child) => child.parentId === PARENT.id);

  private readonly notificationList = signal<AppNotification[]>(freshNotifications());
  readonly notifications = this.notificationList.asReadonly();
  readonly unreadCount = computed(() => this.notificationList().filter((n) => !n.read).length);

  // ---- Account -----------------------------------------------------------

  checkCredentials(email: string, password: string): boolean {
    return email.trim().toLowerCase() === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password;
  }

  // ---- Children ----------------------------------------------------------

  getChild(id: number): Child | undefined {
    return this.children.find((child) => child.id === id);
  }

  // ---- Notes -------------------------------------------------------------

  getSubjects(childId: number): SubjectResult[] {
    return SUBJECTS.filter((subject) => subject.childId === childId).map((subject) => ({
      ...subject,
      average: mean(subject.assessments.map((assessment) => assessment.score)),
    }));
  }

  getGeneralAverage(childId: number): number {
    return mean(this.getSubjects(childId).map((subject) => subject.average));
  }

  // ---- Absences ----------------------------------------------------------

  /** Absences of the current term, most recent first. */
  getAbsences(childId: number): Absence[] {
    return ABSENCES.filter((absence) => absence.childId === childId).sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  }

  getAbsenceToday(childId: number): Absence | undefined {
    return this.getAbsences(childId).find((absence) => absence.date === this.today);
  }

  // ---- Paiements ---------------------------------------------------------

  /** Monthly fees, most recent first. */
  getPayments(childId: number): Payment[] {
    return PAYMENTS.filter((payment) => payment.childId === childId).sort((a, b) =>
      b.period.localeCompare(a.period),
    );
  }

  getUnpaidPayments(childId: number): Payment[] {
    return this.getPayments(childId).filter((payment) => !payment.paidOn);
  }

  getAmountDue(childId: number): number {
    return sum(this.getUnpaidPayments(childId).map((payment) => payment.amount));
  }

  /** Dashboard alert: unpaid fees of all the children, grouped by month. */
  getDueSummary(): DueSummary | null {
    const unpaid = this.children.flatMap((child) => this.getUnpaidPayments(child.id));
    if (unpaid.length === 0) {
      return null;
    }
    const earliest = unpaid.reduce((a, b) => (a.dueDate <= b.dueDate ? a : b));
    return {
      count: new Set(unpaid.map((payment) => payment.period)).size,
      total: sum(unpaid.map((payment) => payment.amount)),
      period: earliest.period,
      dueDate: earliest.dueDate,
      childCount: new Set(unpaid.map((payment) => payment.childId)).size,
    };
  }

  // ---- Notifications -----------------------------------------------------

  markAsRead(id: number): void {
    this.notificationList.update((list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  markAllAsRead(): void {
    this.notificationList.update((list) => list.map((n) => ({ ...n, read: true })));
  }

  /** Puts the demo back in its initial state (called on logout). */
  reset(): void {
    this.notificationList.set(freshNotifications());
  }
}

function freshNotifications(): AppNotification[] {
  return NOTIFICATIONS.map((n) => ({ ...n })).sort((a, b) => b.sentAt.localeCompare(a.sentAt));
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

/** Average rounded to 2 decimals (0 when there is no value). */
function mean(values: number[]): number {
  return values.length ? Math.round((sum(values) / values.length) * 100) / 100 : 0;
}
