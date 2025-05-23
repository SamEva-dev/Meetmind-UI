import { ApplicationConfig, InjectionToken, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'; // Ensure this file exists and the path is correct
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideToastr } from 'ngx-toastr';

export const BASE_API_URL = new InjectionToken<string>('BASE_API_URL');

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: BASE_API_URL, useValue: environment.BASE_API },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, 
            withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), 
            withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
    provideToastr({
      positionClass: 'toast-bottom-right',
      timeOut: 4000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true
    }),
  ]
};
