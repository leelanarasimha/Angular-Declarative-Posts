import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  errorMessageSubject = new Subject<string>();
  errorMessageAction$ = this.errorMessageSubject.asObservable();

  successMessageSubject = new Subject<string>();
  successMessageAction$ = this.successMessageSubject.asObservable();

  setSuccessMessage(message: string) {
    this.successMessageSubject.next(message);
  }

  setErrorMessage(message: string) {
    this.errorMessageSubject.next(message);
  }

  clearErrorMessage() {
    this.setErrorMessage('');
  }

  clearSuccessMessage() {
    this.setSuccessMessage('');
  }

  clearMessages() {
    this.clearErrorMessage();
    this.clearSuccessMessage();
  }
}
