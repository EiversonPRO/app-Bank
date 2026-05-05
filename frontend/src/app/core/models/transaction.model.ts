export type TransactionType = 'TRANSFERENCIA_ENVIADA' | 'TRANSFERENCIA_RECIBIDA' | 'DEPOSITO';

export interface Transaction {
  id: number;
  referenceNumber: string;
  type: TransactionType;
  amount: number;
  description?: string;
  originAccountNumber?: string;
  destinationAccountNumber?: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface TransferRequest {
  originAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  description?: string;
}

export interface DepositRequest {
  accountNumber: string;
  amount: number;
  description?: string;
}
