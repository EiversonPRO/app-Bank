export interface User {
  id: number;
  fullName: string;
  email: string;
  documentNumber: string;
  phone?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  fullName: string;
  email: string;
}
