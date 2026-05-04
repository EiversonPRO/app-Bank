export type AccountType = 'AHORROS' | 'CORRIENTE';

export interface Account {
  id: number;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  active: boolean;
  createdAt: string;
}
