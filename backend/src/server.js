/**
 * Suivi Scolaire — simple REST API for the parent app (Express + MySQL).
 * Demo data only. Every route except /api/login needs the token returned by
 * the login, and only ever returns the data of the logged-in parent.
 */
require('dotenv').config();

const bcrypt = require('bcryptjs');
const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');

const { query } = require('./db');

const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is missing. Copy .env.example to .env first.');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// ---- Helpers ----------------------------------------------------------------

// Note: with Express 5, an error thrown in an async route goes straight to the
// error handler at the bottom of this file.

/** Checks the "Authorization: Bearer <token>" header and sets req.parentId. */
function requireLogin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer /, '');
  try {
    req.parentId = jwt.verify(token, JWT_SECRET).parentId;
    next();
  } catch {
    res.status(401).json({ message: 'Connexion requise.' });
  }
}

/** Makes sure the child in the URL belongs to the logged-in parent. */
async function requireOwnChild(req, res, next) {
  const rows = await query('SELECT id FROM children WHERE id = ? AND parent_id = ?', [
    Number(req.params.childId) || 0,
    req.parentId,
  ]);
  if (rows.length === 0) {
    res.status(404).json({ message: 'Élève introuvable.' });
    return;
  }
  req.childId = rows[0].id;
  next();
}

const PARENT_COLUMNS = 'id, civility, first_name AS firstName, last_name AS lastName, email, phone';

const mean = (values) =>
  values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100 : 0;

// ---- Login --------------------------------------------------------------------

app.post('/api/login', async (req, res) => {
  const { email = '', password = '' } = req.body || {};
  const rows = await query(`SELECT ${PARENT_COLUMNS}, password_hash FROM parents WHERE email = ?`, [
    String(email).trim().toLowerCase(),
  ]);
  const parent = rows[0];
  if (!parent || !(await bcrypt.compare(String(password), parent.password_hash))) {
    res.status(401).json({ message: 'E-mail ou mot de passe incorrect.' });
    return;
  }
  delete parent.password_hash;
  const token = jwt.sign({ parentId: parent.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, parent });
});

// Everything below needs a logged-in parent.
app.use('/api', requireLogin);

// ---- Parent and children --------------------------------------------------------

app.get('/api/me', async (req, res) => {
  const rows = await query(`SELECT ${PARENT_COLUMNS} FROM parents WHERE id = ?`, [req.parentId]);
  res.json(rows[0]);
});

app.get('/api/children', async (req, res) => {
  res.json(
    await query(
      `SELECT id, parent_id AS parentId, first_name AS firstName, last_name AS lastName,
                gender, class_name AS className
         FROM children WHERE parent_id = ? ORDER BY id`,
      [req.parentId],
    ),
  );
});

// ---- Notes ----------------------------------------------------------------------

app.get('/api/children/:childId/grades', requireOwnChild, async (req, res) => {
  const rows = await query(
    'SELECT subject, label, date, score FROM grades WHERE child_id = ? ORDER BY id',
    [req.childId],
  );
  // Group the grades by subject and compute the averages.
  const subjects = [];
  for (const { subject, label, date, score } of rows) {
    let entry = subjects.find((s) => s.name === subject);
    if (!entry) {
      entry = { childId: req.childId, name: subject, assessments: [] };
      subjects.push(entry);
    }
    entry.assessments.push({ label, date, score });
  }
  for (const entry of subjects) {
    entry.average = mean(entry.assessments.map((a) => a.score));
  }
  res.json({ generalAverage: mean(subjects.map((s) => s.average)), subjects });
});

// ---- Absences -------------------------------------------------------------------

app.get('/api/children/:childId/absences', requireOwnChild, async (req, res) => {
  const rows = await query(
    `SELECT id, child_id AS childId, date, duration, justified, reason
       FROM absences WHERE child_id = ? ORDER BY date DESC`,
    [req.childId],
  );
  res.json(rows.map((row) => ({ ...row, justified: !!row.justified })));
});

// ---- Paiements (read only: no payment is ever processed) ----------------------------

app.get('/api/children/:childId/payments', requireOwnChild, async (req, res) => {
  res.json(
    await query(
      `SELECT id, child_id AS childId, period, amount, due_date AS dueDate, paid_on AS paidOn
         FROM payments WHERE child_id = ? ORDER BY period DESC`,
      [req.childId],
    ),
  );
});

// ---- Notifications ----------------------------------------------------------------

app.get('/api/notifications', async (req, res) => {
  const rows = await query(
    `SELECT id, kind, title, body, sent_at AS sentAt, child_id AS childId, is_read AS \`read\`
       FROM notifications WHERE parent_id = ? ORDER BY sent_at DESC`,
    [req.parentId],
  );
  res.json(rows.map((row) => ({ ...row, read: !!row.read })));
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  await query('UPDATE notifications SET is_read = TRUE WHERE id = ? AND parent_id = ?', [
    Number(req.params.id) || 0,
    req.parentId,
  ]);
  res.status(204).end();
});

// ---- Errors ---------------------------------------------------------------------

app.use((req, res) => res.status(404).json({ message: 'Route introuvable.' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erreur du serveur.' });
});

app.listen(PORT, () => console.log(`Suivi Scolaire API: http://localhost:${PORT}`));
