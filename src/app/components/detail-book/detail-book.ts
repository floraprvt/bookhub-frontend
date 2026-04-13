import { Component, signal, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'

export interface Review {
  author: string
  rating: number
  date: Date
  content: string
}

export interface BookDetailInfo {
  id: string
  title: string
  author: string
  category: string
  isbn: string
  description: string
  coverUrl: string
  availableCopies: number
  totalCopies: number
  rating: number
  reviews: Review[]
}

@Component({
  selector: 'app-detail-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-book.html'
})
export class DetailBook implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  
  book = signal<BookDetailInfo | null>(null)
  starsArray = [1, 2, 3, 4, 5]

  ngOnInit() {
    const bookId = this.route.snapshot.paramMap.get('id')
    
    if (bookId) {
      this.loadBook(bookId)
    }
  }

  loadBook(id: string) {
    this.book.set({
      id: id,
      author: 'Gaston Leroux',
      category: 'Roman Policier',
      isbn: '978-2253005490',
      title: 'Le Mystère de la chambre jaune',
      description: 'Le jeune reporter Joseph Rouletabille, accompagné de son ami Sainclair, se rend au château du Glandier pour éclaircir une tentative d\'assassinat. Mathilde Stangerson, la fille du célèbre professeur, a été retrouvée gravement blessée dans une chambre fermée de l\'intérieur...',
      coverUrl: 'assets/arsene.jpg',
      availableCopies: 2,
      totalCopies: 3,
      rating: 4.5,
      reviews: [
        {
          author: 'Marie Curie',
          rating: 5,
          date: new Date('2026-01-10'),
          content: 'Un chef d\'œuvre de la littérature policière ! L\'intrigue est ficelée à la perfection.'
        },
        {
          author: 'Jean Dupont',
          rating: 4,
          date: new Date('2026-01-12'),
          content: 'Très bon livre, même si le début est un peu lent à démarrer.'
        }
      ]
    })
  }

  goBack() {
    this.router.navigate(['/'])
  }

  emprunter() {
    alert('Demande d\'emprunt enregistrée pour 14 jours !')
  }

  reserver() {
    alert('Livre réservé ! Vous serez notifié dès qu\'il sera disponible.')
  }
}