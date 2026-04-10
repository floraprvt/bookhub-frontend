import { Component, signal, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'

export interface DashboardStats {
  totalBooks: number
  activeBorrows: number
  currentOverdues: number
}

export interface OverdueRecord {
  id: string
  memberName: string
  bookTitle: string
  dueDate: Date
  daysOverdue: number
}

export interface TopBook {
  id: string
  rank: number
  title: string
  author: string
  borrowCount: number
  coverUrl: string
}

@Component({
  selector: 'app-librarian-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './librarian-dashboard.html'
})
export class LibrarianDashboard implements OnInit {
  librarianName = signal<string>('Ahmed')

  stats = signal<DashboardStats>({
    totalBooks: 0,
    activeBorrows: 0,
    currentOverdues: 0
  })

  overdues = signal<OverdueRecord[]>([])
  topBooks = signal<TopBook[]>([])

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.stats.set({
      totalBooks: 2000,
      activeBorrows: 285,
      currentOverdues: 18
    })

    this.overdues.set([
      {
        id: '1',
        memberName: 'Jean Dupont',
        bookTitle: 'La Peste',
        dueDate: new Date('2026-01-01'),
        daysOverdue: 7
      },
      {
        id: '2',
        memberName: 'Marie Curie',
        bookTitle: 'L\'Étranger',
        dueDate: new Date('2026-01-05'),
        daysOverdue: 3
      }
    ])

    this.topBooks.set([
      { id: '1', rank: 1, title: 'Le Petit Prince', author: '1984', borrowCount: 120, coverUrl: 'assets/arsene.jpg' },
      { id: '2', rank: 2, title: 'Astérix', author: 'Astérix', borrowCount: 60, coverUrl: 'assets/arsene.jpg' },
      { id: '3', rank: 3, title: 'La Peste', author: 'Jean Dupont', borrowCount: 50, coverUrl: 'assets/arsene.jpg' },
      { id: '4', rank: 4, title: 'Le poulier', author: 'Auteur Vislan', borrowCount: 47, coverUrl: 'assets/arsene.jpg' },
      { id: '5', rank: 5, title: 'Marie Curie', author: 'Auteur Curie', borrowCount: 70, coverUrl: 'assets/arsene.jpg' },
      { id: '6', rank: 6, title: 'L\'Étranger', author: 'Delir Pope', borrowCount: 20, coverUrl: 'assets/arsene.jpg' },
      { id: '7', rank: 8, title: 'Noter tecrvations', author: 'Auteur Vislan', borrowCount: 30, coverUrl: 'assets/arsene.jpg' },
      { id: '8', rank: 10, title: 'Le Petit Princ...', author: 'Auteur HauviliviRon', borrowCount: 10, coverUrl: 'assets/arsene.jpg' }
    ])
  }

  relancer(id: string) {
    alert(`Relance envoyée pour le dossier ${id}`)
  }

  gererRetour(id: string) {
    alert(`Gestion du retour validée pour le dossier ${id}`)
  }
}
