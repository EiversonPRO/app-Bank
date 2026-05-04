import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-new-account-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatRadioModule, FormsModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Abrir nueva cuenta</h2>
    <mat-dialog-content>
      <p class="dialog-subtitle">Selecciona el tipo de cuenta que deseas abrir</p>
      <mat-radio-group [(ngModel)]="selectedType" class="type-group">
        <mat-radio-button value="AHORROS" class="type-option">
          <div class="type-content">
            <mat-icon>savings</mat-icon>
            <div>
              <strong>Cuenta de Ahorros</strong>
              <p>Ideal para guardar y hacer crecer tu dinero</p>
            </div>
          </div>
        </mat-radio-button>
        <mat-radio-button value="CORRIENTE" class="type-option">
          <div class="type-content">
            <mat-icon>account_balance</mat-icon>
            <div>
              <strong>Cuenta Corriente</strong>
              <p>Para el día a día y transacciones frecuentes</p>
            </div>
          </div>
        </mat-radio-button>
      </mat-radio-group>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="!selectedType" (click)="confirm()">
        Abrir cuenta
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-subtitle { color: #757575; font-size: 14px; margin-bottom: 16px; }
    .type-group { display: flex; flex-direction: column; gap: 12px; }
    .type-option { border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px; }
    .type-content { display: flex; align-items: center; gap: 12px; padding: 4px 0;
      mat-icon { color: #283593; font-size: 28px; width: 28px; height: 28px; }
      p { font-size: 12px; color: #757575; margin: 0; }
    }
  `]
})
export class NewAccountDialogComponent {
  selectedType: 'AHORROS' | 'CORRIENTE' | null = null;

  constructor(private dialogRef: MatDialogRef<NewAccountDialogComponent>) {}

  confirm(): void {
    if (this.selectedType) {
      this.dialogRef.close(this.selectedType);
    }
  }
}
