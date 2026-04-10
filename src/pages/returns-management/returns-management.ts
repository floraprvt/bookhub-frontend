import { Component, signal, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive } from '@angular/router'

export interface ActiveLoan {
  id: string
  memberName: string
  bookTitle: string
  borrowDate: Date
  dueDate: Date
  isOverdue: boolean
}

@Component({
  selector: 'app-returns-management',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './returns-management.html'
})
export class ReturnsManagement implements OnInit {
  activeLoans = signal<ActiveLoan[]>([])
  librarianName = signal<string>('Ahmed')

  ngOnInit() {
    this.activeLoans.set([
      { id: 'L1', memberName: 'Jean Dupont', bookTitle: 'La Peste', borrowDate: new Date('2025-12-15'), dueDate: new Date('2026-01-01'), isOverdue: true },
      { id: 'L2', memberName: 'Marie Curie', bookTitle: 'L\'Étranger', borrowDate: new Date('2026-01-02'), dueDate: new Date('2026-01-16'), isOverdue: false }
    ])
  }

  processReturn(loanId: string) {
    alert(`Retour enregistré pour l'emprunt ${loanId}. Le nombre d'exemplaires disponibles a été mis à jour.`)
    this.activeLoans.update(loans => loans.filter(l => l.id !== loanId))
  }
}
