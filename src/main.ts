import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

if ((import.meta as any).env && (import.meta as any).env.PROD) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes, withHashLocation()), provideHttpClient()],
}).catch((err) => console.error(err));
