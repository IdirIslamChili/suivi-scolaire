import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  NavController,
} from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  imports: [ReactiveFormsModule, IonContent, IonInput, IonInputPasswordToggle, IonButton, IonIcon],
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly nav = inject(NavController);

  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  protected readonly error = signal('');

  protected submit(): void {
    if (this.form.invalid) {
      this.error.set('Saisissez votre adresse e-mail et votre mot de passe.');
      return;
    }
    const { email, password } = this.form.getRawValue();
    if (!this.auth.login(email, password)) {
      this.error.set('E-mail ou mot de passe incorrect. Essayez avec le compte démo parent.');
      return;
    }
    this.openApp();
  }

  protected useDemoAccount(): void {
    this.auth.loginWithDemoAccount();
    this.openApp();
  }

  private openApp(): void {
    this.error.set('');
    this.nav.navigateRoot('/tabs/accueil');
  }
}
