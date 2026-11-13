# Suivi Scolaire — parent app

Mobile app for the parents of a private school: grades, absences, school fees and
notifications for each child. The interface is in French.

This is a working prototype of the **parent side only**. All the data is **fake demo data**:
no real school, no real family, no real payment.

- **App**: Angular 20 + Ionic 8, packaged for phones with Capacitor 7
- **API** (optional, in `backend/`): Node.js + Express + MySQL

## Demo account

| E-mail                    | Password   |
| ------------------------- | ---------- |
| `sara.benali@example.com` | `demo1234` |

Or tap **Compte démo parent** on the login screen.

## Run the app

Requires Node.js 20.19 or newer.

```bash
npm install
npm start          # development server on http://localhost:4200
```

Production build (output in `www/`), and a local preview of that build:

```bash
npm run build
npm run preview    # http://localhost:8100
```

## Publish a public web preview (GitHub Pages)

A GitHub Actions workflow is included at `.github/workflows/pages.yml`. Put this project in a
public GitHub repository on the `main` branch, then choose **Settings → Pages → Build and
deployment → GitHub Actions**. Push to `main` (or run the workflow manually); it builds the
app with the repository base path and publishes it at `https://OWNER.github.io/REPOSITORY/`.
The workflow also adds the Angular route fallback required for direct links and refreshes.

## Build the Android app (Capacitor)

Requires Android Studio.

```bash
npm install @capacitor/android
npx cap add android      # once
npm run cap:sync         # build the web app and copy it into the Android project
npx cap open android     # then Run in Android Studio
```

The whole app (code, icons, font, demo data) is inside the package, so it works without
any network connection.

## Screens

| Screen                                                | Route                 | Folder                          |
| ----------------------------------------------------- | --------------------- | ------------------------------- |
| Login                                                 | `/connexion`          | `src/app/screens/login`         |
| Bottom tabs (Accueil, Enfants, Notifications, Profil) | `/tabs`               | `src/app/screens/tabs`          |
| Home / dashboard                                      | `/tabs/accueil`       | `src/app/screens/home`          |
| Children list                                         | `/tabs/enfants`       | `src/app/screens/children`      |
| Child detail (Notes, Absences, Paiements)             | `/tabs/enfants/:id`   | `src/app/screens/child-detail`  |
| Notifications                                         | `/tabs/notifications` | `src/app/screens/notifications` |
| Profile                                               | `/tabs/profil`        | `src/app/screens/profile`       |

## Project structure

```
src/
  app/
    screens/            one folder per screen (see above)
    services/
      demo-data.ts            the fake data itself
      demo-data.service.ts    the single service the screens use to read it
      auth.service.ts         demo login / logout, session kept on the device
    models/             TypeScript interfaces (Parent, Child, Absence, Payment…)
    guards/             route protection (logged in or not)
    shared/             avatar, grade ruler, format pipes, icons, date helpers
  theme/variables.scss  colours and fonts
  global.scss           shared styles (cards, status chips, list rows)
backend/                Express + MySQL API (optional)
```

### About the demo data

- Edit `src/app/services/demo-data.ts` to change children, grades, absences, fees or
  notifications. Subject averages and the general average are computed from the grades.
- The demo is frozen on **Sunday 8 November 2026** (`DEMO_TODAY`), so "absente aujourd’hui"
  and the 10 November due date stay consistent whatever the real date is.
- Colours have one meaning each: blue = brand and grades, green = "Payé",
  orange = "À payer", red = absences.

## Database scripts and optional backend API

The app does not need a server: it reads the local demo data.

### SQL Server (SSMS)

The main database scripts in `backend/sql/` are T-SQL. In SQL Server Management Studio,
open and execute `schema.sql` first, then `seed.sql`. The schema creates the `suivi_scolaire`
database and the seed script inserts the same fake demo records.

SQL Server does not allow the original MySQL delete actions on the `notifications` foreign
keys to create two cascade paths. The T-SQL schema keeps the same tables and FK relationships;
the notification-to-child FK uses `NO ACTION`, so clear a child's notifications or set their
`child_id` to `NULL` before deleting that child.

### Optional Express API (MySQL)

The current Express API still uses `mysql2`. To run it, use the MySQL-compatible copies
`schema.mysql.sql` and `seed.mysql.sql` (rather than the SQL Server scripts):

```bash
cd backend
npm install
mysql -u root -p < sql/schema.mysql.sql
mysql -u root -p < sql/seed.mysql.sql
cp .env.example .env                  # then set your MySQL user / password
npm start                             # http://localhost:3000
```

| Method | Route                         | Returns                                           |
| ------ | ----------------------------- | ------------------------------------------------- |
| POST   | `/api/login`                  | `{ token, parent }` — body: `{ email, password }` |
| GET    | `/api/me`                     | the logged-in parent                              |
| GET    | `/api/children`               | the parent's children                             |
| GET    | `/api/children/:id/grades`    | subjects, grades out of 20, averages              |
| GET    | `/api/children/:id/absences`  | absences of the child                             |
| GET    | `/api/children/:id/payments`  | monthly fees (read only)                          |
| GET    | `/api/notifications`          | notifications of the parent                       |
| PATCH  | `/api/notifications/:id/read` | marks a notification as read                      |

Every route except the login needs the header `Authorization: Bearer <token>`, and only
returns the data of the logged-in parent. Passwords are stored as bcrypt hashes.

To connect the app to the API, replace the method bodies of `DemoDataService` with
`HttpClient` calls to these routes; the JSON has the same shape as the interfaces in
`src/app/models/school.models.ts`.

## Licence

© 2026 Idir Islam Chili — Tous droits réservés.