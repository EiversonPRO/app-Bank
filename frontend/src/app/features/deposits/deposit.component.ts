import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AccountService } from '../../core/services/account.service';
import { TransactionService } from '../../core/services/transaction.service';
import { Account } from '../../core/models/account.model';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

  depositForm: FormGroup;
  accounts: Account[] = [];
  loading = false;
  loadingAccounts = true;
  lastTransaction?: Transaction;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar
  ) {
    this.depositForm = this.fb.group({
      accountNumber: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1000)]],
      description: ['', Validators.maxLength(200)]
    });
  }

  ngOnInit(): void {
    this.accountService.getMyAccounts().subscribe({
      next: (res) => {
        this.accounts = res.data;
        this.loadingAccounts = false;
      },
      error: () => {
        this.loadingAccounts = false;
      }
    });
  }

  get selectedAccount(): Account | undefined {
    const num = this.depositForm.get('accountNumber')?.value;
    return this.accounts.find(a => a.accountNumber === num);
  }

  onSubmit(): void {
    if (this.depositForm.invalid || this.loading) return;

    this.loading = true;
    this.transactionService.deposit(this.depositForm.value).subscribe({
      next: (res) => {
        this.lastTransaction = res.data;
        this.snackBar.open('¡Depósito realizado exitosamente!', '', { duration: 4000 });
        this.depositForm.reset();
        this.loading = false;
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al procesar el depósito';
        this.snackBar.open(msg, 'Cerrar', { duration: 5000, panelClass: 'snack-error' });
        this.loading = false;
      }
    });
  }

  newDeposit(): void {
    this.lastTransaction = undefined;
  }
}
