import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptProvider } from './utils/jwt-interceptor'
import { BROWSER_STORAGE } from './storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(), 
    importProvidersFrom(HttpClientModule), 
    authInterceptProvider,
    { provide: BROWSER_STORAGE, useFactory: () => localStorage }
  ]
};

