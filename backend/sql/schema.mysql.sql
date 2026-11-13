-- Suivi Scolaire — database structure (MySQL 8 / MariaDB)
-- Run:  mysql -u root -p < sql/schema.mysql.sql

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS suivi_scolaire
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE suivi_scolaire;

DROP TABLE IF EXISTS notifications, payments, absences, grades, children, parents;

CREATE TABLE parents (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  civility      ENUM('Mme', 'M.') NOT NULL,
  first_name    VARCHAR(60)  NOT NULL,
  last_name     VARCHAR(60)  NOT NULL,
  email         VARCHAR(120) NOT NULL UNIQUE,
  phone         VARCHAR(30)  NOT NULL,
  password_hash VARCHAR(100) NOT NULL          -- bcrypt, never the plain password
);

CREATE TABLE children (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  parent_id  INT NOT NULL,
  first_name VARCHAR(60) NOT NULL,
  last_name  VARCHAR(60) NOT NULL,
  gender     ENUM('F', 'M') NOT NULL,
  class_name VARCHAR(60) NOT NULL,
  FOREIGN KEY (parent_id) REFERENCES parents (id) ON DELETE CASCADE
);

-- One row per graded piece of work, marked out of 20.
CREATE TABLE grades (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT NOT NULL,
  subject  VARCHAR(60) NOT NULL,
  label    VARCHAR(80) NOT NULL,
  date     DATE NOT NULL,
  score    DECIMAL(4, 2) NOT NULL CHECK (score BETWEEN 0 AND 20),
  FOREIGN KEY (child_id) REFERENCES children (id) ON DELETE CASCADE
);

CREATE TABLE absences (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  child_id  INT NOT NULL,
  date      DATE NOT NULL,
  duration  VARCHAR(30) NOT NULL,              -- Matinée / Après-midi / Journée entière
  justified BOOLEAN NOT NULL DEFAULT FALSE,
  reason    VARCHAR(120) NULL,
  FOREIGN KEY (child_id) REFERENCES children (id) ON DELETE CASCADE
);

-- Monthly school fees in DZD. paid_on IS NULL means "À payer".
CREATE TABLE payments (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT NOT NULL,
  period   DATE NOT NULL,                      -- first day of the month
  amount   INT  NOT NULL,
  due_date DATE NOT NULL,
  paid_on  DATE NULL,
  FOREIGN KEY (child_id) REFERENCES children (id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  parent_id INT NOT NULL,
  child_id  INT NULL,
  kind      ENUM('homework', 'test', 'payment', 'absence') NOT NULL,
  title     VARCHAR(120) NOT NULL,
  body      VARCHAR(255) NOT NULL,
  sent_at   DATETIME NOT NULL,
  is_read   BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (parent_id) REFERENCES parents (id) ON DELETE CASCADE,
  FOREIGN KEY (child_id) REFERENCES children (id) ON DELETE SET NULL
);
