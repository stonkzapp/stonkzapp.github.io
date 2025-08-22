import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { UserProfile, ChangePasswordRequest } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/user-profile`);
  }

  updateUserProfile(data: UserProfile): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/user-profile`, data);
  }

  changePassword(data: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/change-password`, data);
  }
}
