import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { switchMap } from 'rxjs';
import { AccountService } from '../../../core/services/account.service';
import { TransactionService } from '../../../core/services/transaction.service';
import { Account } from '../../../core/models/account.model';
import { Transaction, PageResponse } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatPaginatorModule
  ],
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss']
})
export class AccountDetailComponent implements OnInit {

  account?: Account;
  transactionPage?: PageResponse<Transaction>;
  loading = true;
  txLoading = false;
  currentPage = 0;
  pageSize = 10;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => this.accountService.getAccountById(+params['id']))
    ).subscribe({
      next: (res) => {
        this.account = res.data;
        this.loading = false;
        this.loadTransactions();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadTransactions(): void {
    if (!this.account) return;
    this.txLoading = true;
    this.transactionService.getTransactionsByAccount(this.account.id, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.transactionPage = res.data;
        this.txLoading = false;
      },
      error: () => {
        this.txLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTransactions();
  }

  isDebit(tx: Transaction): boolean {
    return tx.originAccountNumber === this.account?.accountNumber;
  }
}
