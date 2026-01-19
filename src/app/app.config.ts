import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // ✅ correct import

// ✅ Import Angular Material dialog + animations support
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideMomentDateAdapter(),
    provideHttpClient(withInterceptors([authInterceptor])), // ✅ correct usage

    // ✅ Enables Angular Material animations globally
    provideAnimations(),

    // ✅ Optional: global dialog configuration
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        disableClose: false,
        autoFocus: true,
        width: '400px',
      },
    },
  ]
    
};
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideAnimations(),
//     { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
//   ],
// };