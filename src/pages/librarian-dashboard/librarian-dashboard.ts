import { Component, signal, OnInit, AfterViewInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const API_URL = 'http://localhost:8080'

export interface DashboardStats {
  totalBooks: number
  activeLoans: number
  overdueLoans: number
}

export interface OverdueRecord {
  loanId: number
  userId: number
  userFirstName: string
  userLastName: string
  bookTitle: string
  returnDate: string
  daysOverdue: number
}

export interface TopBook {
  bookId: number
  title: string
  loanCount: number
}

@Component({
  selector: 'app-librarian-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './librarian-dashboard.html'
})
export class LibrarianDashboard implements OnInit, AfterViewInit {
  private readonly http = inject(HttpClient)

  stats = signal<DashboardStats>({ totalBooks: 0, activeLoans: 0, overdueLoans: 0 })
  overdues = signal<OverdueRecord[]>([])
  topBooks = signal<TopBook[]>([])

  ngOnInit() {
    this.loadData()
  }

  ngAfterViewInit() {
    const canvas = document.getElementById('borrowChart') as HTMLCanvasElement
    if (canvas) {
      new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
          datasets: [{
            label: 'Emprunts',
            data: [120, 150, 180, 170, 220, 285],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      })
    }
  }

  loadData() {
    this.http.get<DashboardStats>(`${API_URL}/api/loans/stats`).subscribe({
      next: (data) => this.stats.set(data)
    })

    this.http.get<OverdueRecord[]>(`${API_URL}/api/loans/overdue`).subscribe({
      next: (data) => this.overdues.set(data)
    })

    this.http.get<TopBook[]>(`${API_URL}/api/loans/top10`).subscribe({
      next: (data) => this.topBooks.set(data)
    })
  }

  relancer(loanId: number) {
    alert(`Relance envoyée pour l'emprunt #${loanId}`)
  }

  gererRetour(loanId: number) {
    alert(`Retour validé pour l'emprunt #${loanId}`)
  }
}
