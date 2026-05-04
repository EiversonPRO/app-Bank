import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AccountService } from '../../../core/services/account.service';
import { Account } from '../../../core/models/account.model';
import { NewAccountDialogComponent } from './new-account-dialog/new-account-dialog.component';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {

  accounts: Account[] = [];
  loading = true;

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  get totalBalance(): number {
    return this.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }

  loadAccounts(): void {
    this.loading = true;
    this.accountService.getMyAccounts().subscribe({
      next: (res) => {
        this.accounts = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openNewAccountDialog(): void {
    const dialogRef = this.dialog.open(NewAccountDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: 'AHORROS' | 'CORRIENTE' | undefined) => {
      if (result) {
        this.accountService.createAccount(result).subscribe({
          next: () => {
            this.snackBar.open('Cuenta creada exitosamente', '', { duration: 3000 });
            this.loadAccounts();
          },
          error: (err) => {
            const msg = err.error?.message || 'Error al crear la cuenta';
            this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
          }
        });
      }
    });
  }
}
