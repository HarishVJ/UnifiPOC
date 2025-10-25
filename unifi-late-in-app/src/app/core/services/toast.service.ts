import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage>({
    message: '',
    type: 'info',
    show: false
  });

  toast$ = this.toastSubject.asObservable();

  showSuccess(message: string): void {
    this.show(message, 'success');
  }

  showError(message: string): void {
    this.show(message, 'error');
  }

  showInfo(message: string): void {
    this.show(message, 'info');
  }

  private show(message: string, type: 'success' | 'error' | 'info'): void {
    this.toastSubject.next({ message, type, show: true });
    
    setTimeout(() => {
      this.toastSubject.next({ message: '', type: 'info', show: false });
    }, 3000);
  }
}
