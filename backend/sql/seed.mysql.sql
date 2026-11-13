-- Suivi Scolaire — FAKE DEMO DATA, for demonstration only.
-- Same data as the mobile app (src/app/services/demo-data.ts).
-- Run after schema.mysql.sql:  mysql -u root -p < sql/seed.mysql.sql

USE suivi_scolaire;
SET NAMES utf8mb4;

-- Demo account: sara.benali@example.com / demo1234
INSERT INTO parents (id, civility, first_name, last_name, email, phone, password_hash) VALUES
  (1, 'Mme', 'Sara', 'Benali', 'sara.benali@example.com', '+213 550 00 00 00',
   '$2b$10$2J0fL9IXL2Iv9zJxCUFzXu7znAvLS9lDSK84XDh/fU.JbH4CKIBd2');

INSERT INTO children (id, parent_id, first_name, last_name, gender, class_name) VALUES
  (1, 1, 'Lina',   'Benali', 'F', '4e année primaire'),
  (2, 1, 'Yacine', 'Benali', 'M', '2e année moyenne');

INSERT INTO grades (child_id, subject, label, date, score) VALUES
  -- Lina: Maths 16, Français 14, Arabe 15 -> general average 15
  (1, 'Mathématiques', 'Devoir n° 1', '2026-10-07', 15),
  (1, 'Mathématiques', 'Devoir n° 2', '2026-11-03', 17),
  (1, 'Français',      'Dictée',      '2026-10-12', 13),
  (1, 'Français',      'Devoir n° 1', '2026-10-28', 15),
  (1, 'Arabe',         'Devoir n° 1', '2026-10-05', 14),
  (1, 'Arabe',         'Récitation',  '2026-10-27', 16),
  -- Yacine: Maths 12, Français 13, Sciences 14 -> general average 13
  (2, 'Mathématiques', 'Devoir surveillé n° 1', '2026-10-08', 11),
  (2, 'Mathématiques', 'Interrogation',         '2026-11-02', 13),
  (2, 'Français',      'Devoir surveillé n° 1', '2026-10-14', 12),
  (2, 'Français',      'Expression écrite',     '2026-10-29', 14),
  (2, 'Sciences',      'Devoir surveillé n° 1', '2026-10-11', 13),
  (2, 'Sciences',      'Travaux pratiques',     '2026-11-04', 15);

INSERT INTO absences (child_id, date, duration, justified, reason) VALUES
  (1, '2026-10-13', 'Journée entière', TRUE,  'Certificat médical'),
  (1, '2026-11-08', 'Matinée',         FALSE, NULL),
  (2, '2026-10-19', 'Après-midi',      TRUE,  'Rendez-vous médical');

INSERT INTO payments (child_id, period, amount, due_date, paid_on) VALUES
  (1, '2026-10-01',  8000, '2026-10-10', '2026-10-06'),
  (1, '2026-11-01',  8000, '2026-11-10', NULL),
  (2, '2026-10-01', 10000, '2026-10-10', '2026-10-06'),
  (2, '2026-11-01', 10000, '2026-11-10', NULL);

INSERT INTO notifications (parent_id, child_id, kind, title, body, sent_at, is_read) VALUES
  (1, 2,    'homework', 'Devoir de mathématiques pour jeudi',
   'Yacine : exercices 4 à 7, page 52, à préparer pour jeudi 12 novembre.', '2026-11-08 11:20:00', FALSE),
  (1, 1,    'absence',  'Lina absente aujourd’hui',
   'Lina n’était pas en classe ce matin. Merci de transmettre un justificatif à l’école.', '2026-11-08 08:40:00', FALSE),
  (1, NULL, 'payment',  'Paiement de novembre à régler',
   'Échéance dans 3 jours, le 10 novembre : 18 000 DA pour Lina et Yacine.', '2026-11-07 09:00:00', FALSE),
  (1, 1,    'test',     'Contrôle de français lundi',
   'Lina : contrôle de conjugaison (présent de l’indicatif) lundi 9 novembre.', '2026-11-05 14:30:00', TRUE);
