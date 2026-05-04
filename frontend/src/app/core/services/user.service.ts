import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.base}/me`);
  }

  updateProfile(payload: { fullName?: string; phone?: string }): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.base}/me`, payload);
  }
}
