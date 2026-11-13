/** Data shapes used by the parent app. Dates are ISO strings (YYYY-MM-DD). */

export interface Parent {
  id: number;
  civility: 'Mme' | 'M.';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Child {
  id: number;
  parentId: number;
  firstName: string;
  lastName: string;
  gender: 'F' | 'M';
  className: string;
  /** Colour of the photo placeholder. */
  avatarTone: 'blue' | 'sky';
}

/** One graded piece of work, marked out of 20. */
export interface Assessment {
  label: string;
  date: string;
  score: number;
}

export interface Subject {
  childId: number;
  name: string;
  assessments: Assessment[];
}

/** A subject with its computed average, ready to display. */
export interface SubjectResult extends Subject {
  average: number;
}

export interface Absence {
  id: number;
  childId: number;
  date: string;
  duration: 'Matinée' | 'Après-midi' | 'Journée entière';
  justified: boolean;
  reason?: string;
}

export interface Payment {
  id: number;
  childId: number;
  /** First day of the month the fee covers. */
  period: string;
  /** Amount in Algerian dinars (DZD). */
  amount: number;
  dueDate: string;
  /** Set when the fee has been paid ("Payé"); missing means "À payer". */
  paidOn?: string;
}

export type NotificationKind = 'homework' | 'test' | 'payment' | 'absence';

export interface AppNotification {
  id: number;
  kind: NotificationKind;
  title: string;
  body: string;
  /** ISO date and time (YYYY-MM-DDTHH:mm). */
  sentAt: string;
  childId?: number;
  read: boolean;
}

/** Unpaid fees grouped for the dashboard alert. */
export interface DueSummary {
  /** Number of months with at least one unpaid fee. */
  count: number;
  total: number;
  period: string;
  dueDate: string;
  childCount: number;
}
