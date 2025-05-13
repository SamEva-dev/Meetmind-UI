import { ApplicationConfig, InjectionToken, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; 

import { providePrimeNG } from 'primeng/config'; 
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';

export const BASE_API_URL = new InjectionToken<string>('BaseApiUrl');

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: BASE_API_URL, useValue: environment.apiUrl },
    { provide: HTTP_INTERCEPTORS, useValue: AuthInterceptor, multi: true },
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideAnimationsAsync(), 
    providePrimeNG({
      theme: {
          preset: Aura
      }
  }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
  ]
};
