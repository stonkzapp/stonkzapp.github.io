import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import {
  OTPRequest,
  ResendConfirmationRequest,
  UserRegistration,
} from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService extends BaseService {
  register(data: UserRegistration): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, data);
  }

  confirmRegistration(data: OTPRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/confirmation`, data);
  }

  resendConfirmation(data: ResendConfirmationRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/resend-confirmation`, data);
  }
}
