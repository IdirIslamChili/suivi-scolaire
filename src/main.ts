import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// The whole app is in French: dates and numbers use the "fr" locale.
registerLocaleData(localeFr);

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
