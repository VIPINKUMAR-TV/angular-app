import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  log(error: unknown): void {
    console.error('API error', error);
  }

  getUserMessage(error: unknown): string {
    return 'Something went wrong. Please try again.';
  }
}