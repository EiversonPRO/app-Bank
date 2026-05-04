import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Transaction, TransferRequest, PageResponse } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private readonly base = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  transfer(payload: TransferRequest): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(`${this.base}/transfer`, payload);
  }

  getTransactionsByAccount(accountId: number, page = 0, size = 10): Observable<ApiResponse<PageResponse<Transaction>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PageResponse<Transaction>>>(`${this.base}/account/${accountId}`, { params });
  }

  getRecentTransactions(): Observable<ApiResponse<Transaction[]>> {
    return this.http.get<ApiResponse<Transaction[]>>(`${this.base}/recent`);
  }
}
