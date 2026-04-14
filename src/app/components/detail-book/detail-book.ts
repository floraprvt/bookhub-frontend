import { Component, signal, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { Book, RoleEnum } from '../../interface'

@Component({
  selector: 'app-detail-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-book.html'
})
export class DetailBook implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  
  book = signal<Book | null>(null)
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
      authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }],
      categories: [{ id:1, name: 'Roman Policier'}],
      isbn: '978-2253005490',
      title: 'Le Mystère de la chambre jaune',
      description: 'Le jeune reporter Joseph Rouletabille, accompagné de son ami Sainclair, se rend au château du Glandier pour éclaircir une tentative d\'assassinat. Mathilde Stangerson, la fille du célèbre professeur, a été retrouvée gravement blessée dans une chambre fermée de l\'intérieur...',
      image: 'assets/arsene.jpg',
      date: '1907-09-01',
      isAvailable: true,
      availableCopies: 2,
      totalCopies: 3,
      ratings: [
        {
          id: 1,
          date: new Date('2026-01-10'),
          score: 5,
          comment: 'Un chef d\'œuvre de la littérature policière !',
          user: { id: 101, firstName: 'Marie', lastName: 'Curie', email: 'm@curie.com', role: 'USER' as RoleEnum }
        },
        {
          id: 2,
          date: new Date('2026-01-12'),
          score: 4,
          comment: 'Très bon livre, même si le début est un peu lent.',
          user: { id: 102, firstName: 'Jean', lastName: 'Dupont', email: 'j@dupont.com', role: 'USER' as RoleEnum }
        }
      ]
    })
  }

  getAverageRating(ratings?: any[]): number {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, review) => acc + review.score, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
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