import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { forkJoin } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { TransactionService } from '../../core/services/transaction.service';
import { AuthService } from '../../core/services/auth.service';
import { Account } from '../../core/models/account.model';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  accounts: Account[] = [];
  recentTransactions: Transaction[] = [];
  loading = true;
  userName = '';

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.currentUser()?.fullName?.split(' ')[0] ?? 'usuario';
    this.loadData();
  }

  get totalBalance(): number {
    return this.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }

  loadData(): void {
    forkJoin({
      accounts: this.accountService.getMyAccounts(),
      transactions: this.transactionService.getRecentTransactions()
    }).subscribe({
      next: ({ accounts, transactions }) => {
        this.accounts = accounts.data;
        this.recentTransactions = transactions.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goToTransfer(): void {
    this.router.navigate(['/transfers']);
  }

  goToAccounts(): void {
    this.router.navigate(['/accounts']);
  }

  isDebit(transaction: Transaction): boolean {
    return transaction.type === 'TRANSFERENCIA_ENVIADA';
  }
}
