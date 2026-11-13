-- Suivi Scolaire — fake demonstration data for SQL Server.
-- Run schema.sql first, then execute this script in SQL Server Management Studio.

USE [suivi_scolaire];
GO

-- Demo account: sara.benali@example.com / demo1234
SET IDENTITY_INSERT dbo.parents ON;
GO
INSERT INTO dbo.parents (id, civility, first_name, last_name, email, phone, password_hash) VALUES
  (1, N'Mme', N'Sara', N'Benali', N'sara.benali@example.com', N'+213 550 00 00 00',
   N'$2b$10$2J0fL9IXL2Iv9zJxCUFzXu7znAvLS9lDSK84XDh/fU.JbH4CKIBd2');
GO
SET IDENTITY_INSERT dbo.parents OFF;
GO

SET IDENTITY_INSERT dbo.children ON;
GO
INSERT INTO dbo.children (id, parent_id, first_name, last_name, gender, class_name) VALUES
  (1, 1, N'Lina',   N'Benali', N'F', N'4e année primaire'),
  (2, 1, N'Yacine', N'Benali', N'M', N'2e année moyenne');
GO
SET IDENTITY_INSERT dbo.children OFF;
GO

INSERT INTO dbo.grades (child_id, subject, label, [date], score) VALUES
  -- Lina: Maths 16, Français 14, Arabe 15 -> general average 15
  (1, N'Mathématiques', N'Devoir n° 1', '20261007', 15),
  (1, N'Mathématiques', N'Devoir n° 2', '20261103', 17),
  (1, N'Français',      N'Dictée',      '20261012', 13),
  (1, N'Français',      N'Devoir n° 1', '20261028', 15),
  (1, N'Arabe',         N'Devoir n° 1', '20261005', 14),
  (1, N'Arabe',         N'Récitation',  '20261027', 16),
  -- Yacine: Maths 12, Français 13, Sciences 14 -> general average 13
  (2, N'Mathématiques', N'Devoir surveillé n° 1', '20261008', 11),
  (2, N'Mathématiques', N'Interrogation',         '20261102', 13),
  (2, N'Français',      N'Devoir surveillé n° 1', '20261014', 12),
  (2, N'Français',      N'Expression écrite',     '20261029', 14),
  (2, N'Sciences',      N'Devoir surveillé n° 1', '20261011', 13),
  (2, N'Sciences',      N'Travaux pratiques',     '20261104', 15);
GO

INSERT INTO dbo.absences (child_id, [date], duration, justified, reason) VALUES
  (1, '20261013', N'Journée entière', 1, N'Certificat médical'),
  (1, '20261108', N'Matinée',         0, NULL),
  (2, '20261019', N'Après-midi',      1, N'Rendez-vous médical');
GO

INSERT INTO dbo.payments (child_id, period, amount, due_date, paid_on) VALUES
  (1, '20261001',  8000, '20261010', '20261006'),
  (1, '20261101',  8000, '20261110', NULL),
  (2, '20261001', 10000, '20261010', '20261006'),
  (2, '20261101', 10000, '20261110', NULL);
GO

INSERT INTO dbo.notifications (parent_id, child_id, kind, title, body, sent_at, is_read) VALUES
  (1, 2,    N'homework', N'Devoir de mathématiques pour jeudi',
   N'Yacine : exercices 4 à 7, page 52, à préparer pour jeudi 12 novembre.', '2026-11-08T11:20:00', 0),
  (1, 1,    N'absence',  N'Lina absente aujourd’hui',
   N'Lina n’était pas en classe ce matin. Merci de transmettre un justificatif à l’école.', '2026-11-08T08:40:00', 0),
  (1, NULL, N'payment',  N'Paiement de novembre à régler',
   N'Échéance dans 3 jours, le 10 novembre : 18 000 DA pour Lina et Yacine.', '2026-11-07T09:00:00', 0),
  (1, 1,    N'test',     N'Contrôle de français lundi',
   N'Lina : contrôle de conjugaison (présent de l’indicatif) lundi 9 novembre.', '2026-11-05T14:30:00', 1);
GO
