import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private readonly base = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) {}

  getMyAccounts(): Observable<ApiResponse<Account[]>> {
    return this.http.get<ApiResponse<Account[]>>(this.base);
  }

  getAccountById(id: number): Observable<ApiResponse<Account>> {
    return this.http.get<ApiResponse<Account>>(`${this.base}/${id}`);
  }

  createAccount(accountType: 'AHORROS' | 'CORRIENTE'): Observable<ApiResponse<Account>> {
    return this.http.post<ApiResponse<Account>>(this.base, { accountType });
  }
}
