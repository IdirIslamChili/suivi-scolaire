import { Absence, AppNotification, Child, Parent, Payment, Subject } from '../models/school.models';

/**
 * FAKE DEMO DATA — for demonstration only.
 * Nothing here comes from a real school, a real family or a real payment.
 * This file only holds the raw data; screens read it through DemoDataService.
 */

/**
 * The demo is frozen on this day (a Sunday, i.e. a school day in Algeria) so that
 * "absente aujourd'hui" and "échéance le 10 novembre" always stay consistent.
 */
export const DEMO_TODAY = '2026-11-08';
export const SCHOOL_YEAR = '2026–2027';
export const TERM_LABEL = '1er trimestre';

export const DEMO_ACCOUNT = {
  email: 'sara.benali@example.com',
  password: 'demo1234',
};

export const PARENT: Parent = {
  id: 1,
  civility: 'Mme',
  firstName: 'Sara',
  lastName: 'Benali',
  email: DEMO_ACCOUNT.email,
  phone: '+213 550 00 00 00',
};

export const CHILDREN: Child[] = [
  {
    id: 1,
    parentId: 1,
    firstName: 'Lina',
    lastName: 'Benali',
    gender: 'F',
    className: '4e année primaire',
    avatarTone: 'blue',
  },
  {
    id: 2,
    parentId: 1,
    firstName: 'Yacine',
    lastName: 'Benali',
    gender: 'M',
    className: '2e année moyenne',
    avatarTone: 'sky',
  },
];

/** Grades out of 20. Subject and general averages are computed by the service. */
export const SUBJECTS: Subject[] = [
  // Lina — averages: Maths 16, Français 14, Arabe 15 → general 15
  {
    childId: 1,
    name: 'Mathématiques',
    assessments: [
      { label: 'Devoir n° 1', date: '2026-10-07', score: 15 },
      { label: 'Devoir n° 2', date: '2026-11-03', score: 17 },
    ],
  },
  {
    childId: 1,
    name: 'Français',
    assessments: [
      { label: 'Dictée', date: '2026-10-12', score: 13 },
      { label: 'Devoir n° 1', date: '2026-10-28', score: 15 },
    ],
  },
  {
    childId: 1,
    name: 'Arabe',
    assessments: [
      { label: 'Devoir n° 1', date: '2026-10-05', score: 14 },
      { label: 'Récitation', date: '2026-10-27', score: 16 },
    ],
  },
  // Yacine — averages: Maths 12, Français 13, Sciences 14 → general 13
  {
    childId: 2,
    name: 'Mathématiques',
    assessments: [
      { label: 'Devoir surveillé n° 1', date: '2026-10-08', score: 11 },
      { label: 'Interrogation', date: '2026-11-02', score: 13 },
    ],
  },
  {
    childId: 2,
    name: 'Français',
    assessments: [
      { label: 'Devoir surveillé n° 1', date: '2026-10-14', score: 12 },
      { label: 'Expression écrite', date: '2026-10-29', score: 14 },
    ],
  },
  {
    childId: 2,
    name: 'Sciences',
    assessments: [
      { label: 'Devoir surveillé n° 1', date: '2026-10-11', score: 13 },
      { label: 'Travaux pratiques', date: '2026-11-04', score: 15 },
    ],
  },
];

export const ABSENCES: Absence[] = [
  // Lina — 2 absences this term
  {
    id: 1,
    childId: 1,
    date: '2026-10-13',
    duration: 'Journée entière',
    justified: true,
    reason: 'Certificat médical',
  },
  { id: 2, childId: 1, date: DEMO_TODAY, duration: 'Matinée', justified: false },
  // Yacine — 1 absence this term
  {
    id: 3,
    childId: 2,
    date: '2026-10-19',
    duration: 'Après-midi',
    justified: true,
    reason: 'Rendez-vous médical',
  },
];

/** Monthly school fees in DZD. A fee without "paidOn" is still "À payer". */
export const PAYMENTS: Payment[] = [
  {
    id: 1,
    childId: 1,
    period: '2026-10-01',
    amount: 8000,
    dueDate: '2026-10-10',
    paidOn: '2026-10-06',
  },
  { id: 2, childId: 1, period: '2026-11-01', amount: 8000, dueDate: '2026-11-10' },
  {
    id: 3,
    childId: 2,
    period: '2026-10-01',
    amount: 10000,
    dueDate: '2026-10-10',
    paidOn: '2026-10-06',
  },
  { id: 4, childId: 2, period: '2026-11-01', amount: 10000, dueDate: '2026-11-10' },
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    kind: 'homework',
    title: 'Devoir de mathématiques pour jeudi',
    body: 'Yacine : exercices 4 à 7, page 52, à préparer pour jeudi 12 novembre.',
    sentAt: '2026-11-08T11:20',
    childId: 2,
    read: false,
  },
  {
    id: 2,
    kind: 'absence',
    title: 'Lina absente aujourd’hui',
    body: 'Lina n’était pas en classe ce matin. Merci de transmettre un justificatif à l’école.',
    sentAt: '2026-11-08T08:40',
    childId: 1,
    read: false,
  },
  {
    id: 3,
    kind: 'payment',
    title: 'Paiement de novembre à régler',
    body: 'Échéance dans 3 jours, le 10 novembre : 18\u00a0000\u00a0DA pour Lina et Yacine.',
    sentAt: '2026-11-07T09:00',
    read: false,
  },
  {
    id: 4,
    kind: 'test',
    title: 'Contrôle de français lundi',
    body: 'Lina : contrôle de conjugaison (présent de l’indicatif) lundi 9 novembre.',
    sentAt: '2026-11-05T14:30',
    childId: 1,
    read: true,
  },
];
