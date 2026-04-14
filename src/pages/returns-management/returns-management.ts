import { Component, signal, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Loan } from '../../app/interface'

const API_URL = 'http://localhost:8080'

@Component({
  selector: 'app-returns-management',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './returns-management.html'
})
export class ReturnsManagement implements OnInit {
  private readonly http = inject(HttpClient)

  activeLoans = signal<Loan[]>([])

  ngOnInit() {
    this.loadActiveLoans()
  }

  loadActiveLoans() {
    this.http.get<Loan[]>(`${API_URL}/api/loans`).subscribe({
      next: (loans) => this.activeLoans.set(loans.filter(l => !l.isReturned))
    })
  }

  processReturn(loanId: number) {
    this.http.put<void>(`${API_URL}/api/loans/${loanId}/return`, {}).subscribe({
      next: () => this.activeLoans.update(loans => loans.filter(l => l.id !== loanId)),
      error: (err) => alert(err.error?.message ?? 'Une erreur est survenue, réessayez.')
    })
  }
}
