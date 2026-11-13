import { Injectable, inject, signal } from '@angular/core';

import { DemoDataService } from './demo-data.service';

const SESSION_KEY = 'suivi-scolaire.session';

/**
 * Demo login: checks the credentials against the local demo account and
 * remembers the session on the device, so the app reopens offline.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly data = inject(DemoDataService);

  readonly isLoggedIn = signal(readSession());

  login(email: string, password: string): boolean {
    if (!this.data.checkCredentials(email, password)) {
      return false;
    }
    writeSession(true);
    this.isLoggedIn.set(true);
    return true;
  }

  loginWithDemoAccount(): void {
    const { email, password } = this.data.demoAccount;
    this.login(email, password);
  }

  logout(): void {
    writeSession(false);
    this.isLoggedIn.set(false);
    this.data.reset();
  }
}

// localStorage can be unavailable (private mode, embedded preview): the app
// then still works, the session just is not remembered after a reload.
function readSession(): boolean {
  try {
    return localStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function writeSession(active: boolean): void {
  try {
    if (active) {
      localStorage.setItem(SESSION_KEY, '1');
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // Ignored on purpose, see above.
  }
}
