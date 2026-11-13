-- Suivi Scolaire — SQL Server schema (T-SQL)
-- Run this script in SQL Server Management Studio, then run seed.sql.

IF DB_ID(N'suivi_scolaire') IS NULL
BEGIN
  EXEC (N'CREATE DATABASE [suivi_scolaire]');
END;
GO

USE [suivi_scolaire];
GO

-- Drop dependants first so the schema can be re-created safely.
DROP TABLE IF EXISTS dbo.notifications;
DROP TABLE IF EXISTS dbo.payments;
DROP TABLE IF EXISTS dbo.absences;
DROP TABLE IF EXISTS dbo.grades;
DROP TABLE IF EXISTS dbo.children;
DROP TABLE IF EXISTS dbo.parents;
GO

CREATE TABLE dbo.parents (
  id            INT IDENTITY(1,1) NOT NULL,
  civility      NVARCHAR(3)   NOT NULL,
  first_name    NVARCHAR(60)  NOT NULL,
  last_name     NVARCHAR(60)  NOT NULL,
  email         NVARCHAR(120) NOT NULL,
  phone         NVARCHAR(30)  NOT NULL,
  password_hash NVARCHAR(100) NOT NULL, -- bcrypt, never the plain password
  CONSTRAINT PK_parents PRIMARY KEY (id),
  CONSTRAINT UQ_parents_email UNIQUE (email),
  CONSTRAINT CK_parents_civility CHECK (civility IN (N'Mme', N'M.'))
);
GO

CREATE TABLE dbo.children (
  id         INT IDENTITY(1,1) NOT NULL,
  parent_id  INT NOT NULL,
  first_name NVARCHAR(60) NOT NULL,
  last_name  NVARCHAR(60) NOT NULL,
  gender     NVARCHAR(1)  NOT NULL,
  class_name NVARCHAR(60) NOT NULL,
  CONSTRAINT PK_children PRIMARY KEY (id),
  CONSTRAINT CK_children_gender CHECK (gender IN (N'F', N'M')),
  CONSTRAINT FK_children_parents FOREIGN KEY (parent_id)
    REFERENCES dbo.parents (id) ON DELETE CASCADE
);
GO

-- One row per graded piece of work, marked out of 20.
CREATE TABLE dbo.grades (
  id       INT IDENTITY(1,1) NOT NULL,
  child_id INT NOT NULL,
  subject  NVARCHAR(60) NOT NULL,
  label    NVARCHAR(80) NOT NULL,
  [date]   DATE NOT NULL,
  score    DECIMAL(4, 2) NOT NULL,
  CONSTRAINT PK_grades PRIMARY KEY (id),
  CONSTRAINT CK_grades_score CHECK (score BETWEEN 0 AND 20),
  CONSTRAINT FK_grades_children FOREIGN KEY (child_id)
    REFERENCES dbo.children (id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.absences (
  id        INT IDENTITY(1,1) NOT NULL,
  child_id  INT NOT NULL,
  [date]    DATE NOT NULL,
  duration  NVARCHAR(30) NOT NULL, -- Matinée / Après-midi / Journée entière
  justified BIT NOT NULL CONSTRAINT DF_absences_justified DEFAULT (0),
  reason    NVARCHAR(120) NULL,
  CONSTRAINT PK_absences PRIMARY KEY (id),
  CONSTRAINT CK_absences_duration CHECK (duration IN (N'Matinée', N'Après-midi', N'Journée entière')),
  CONSTRAINT FK_absences_children FOREIGN KEY (child_id)
    REFERENCES dbo.children (id) ON DELETE CASCADE
);
GO

-- Monthly school fees in DZD. paid_on IS NULL means "À payer".
CREATE TABLE dbo.payments (
  id       INT IDENTITY(1,1) NOT NULL,
  child_id INT NOT NULL,
  period   DATE NOT NULL, -- first day of the month
  amount   INT NOT NULL,
  due_date DATE NOT NULL,
  paid_on  DATE NULL,
  CONSTRAINT PK_payments PRIMARY KEY (id),
  CONSTRAINT FK_payments_children FOREIGN KEY (child_id)
    REFERENCES dbo.children (id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.notifications (
  id        INT IDENTITY(1,1) NOT NULL,
  parent_id INT NOT NULL,
  child_id  INT NULL,
  kind      NVARCHAR(20)  NOT NULL,
  title     NVARCHAR(120) NOT NULL,
  body      NVARCHAR(255) NOT NULL,
  sent_at   DATETIME2(0) NOT NULL,
  is_read   BIT NOT NULL CONSTRAINT DF_notifications_is_read DEFAULT (0),
  CONSTRAINT PK_notifications PRIMARY KEY (id),
  CONSTRAINT CK_notifications_kind CHECK (kind IN (N'homework', N'test', N'payment', N'absence')),
  CONSTRAINT FK_notifications_parents FOREIGN KEY (parent_id)
    REFERENCES dbo.parents (id) ON DELETE CASCADE,
  -- SQL Server rejects the original pair of cascading paths from parents to notifications.
  -- Keep the same FK relationship; delete a child's notifications or set child_id to NULL first.
  CONSTRAINT FK_notifications_children FOREIGN KEY (child_id)
    REFERENCES dbo.children (id) ON DELETE NO ACTION
);
GO
