import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080';

export interface ApiLoan {
  id: number;
  loanDate: string;
  returnDate: string;
  isReturned: boolean;
  userId: number;
  bookTitle: string;
  late: boolean;
  bookId: string | number
}

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private readonly http = inject(HttpClient);
  getMyLoans(): Observable<Record<string, ApiLoan[]>> {
    return this.http.get<Record<string, ApiLoan[]>>(`${API_URL}/api/loans/my`);
  }
}