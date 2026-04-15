import { Component, signal, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Book } from '../../interface'
import { BookService } from '../../services/book'

@Component({
  selector: 'app-detail-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-book.html'
})
export class DetailBook implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private bookService = inject(BookService)
  
  book = signal<Book | null>(null)
  ratings = signal<any[]>([])
  starsArray = [1, 2, 3, 4, 5]

  newScore = signal(0)
  hoverScore = signal(0)
  newComment = ''
  isSubmitting = signal(false)
  ratingSuccess = signal(false)
  ratingError = signal<string | false>(false)

  ngOnInit() {
    const bookParamId = this.route.snapshot.paramMap.get('id')
    if (bookParamId) {
      const bookId = Number(bookParamId)
      this.bookService.getBookById(bookId).subscribe({
        next: (value) => this.book.set(value),
        error: (error: any) => console.log(error)
      })
      this.loadRatings(bookId)
    }
  }

  loadRatings(bookId: number) {
    this.bookService.getRatings(bookId).subscribe({
      next: (data) => this.ratings.set(data)
    })
  }

  // loadBook(id: string) {
  //   this.book.set({
  //     id: id,
  //     authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }],
  //     categories: [{ id:1, name: 'Roman Policier'}],
  //     isbn: '978-2253005490',
  //     title: 'Le Mystère de la chambre jaune',
  //     description: 'Le jeune reporter Joseph Rouletabille, accompagné de son ami Sainclair, se rend au château du Glandier pour éclaircir une tentative d\'assassinat. Mathilde Stangerson, la fille du célèbre professeur, a été retrouvée gravement blessée dans une chambre fermée de l\'intérieur...',
  //     image: 'assets/arsene.jpg',
  //     date: '1907-09-01',
  //     isAvailable: true,
  //     availableCopies: 2,
  //     totalCopies: 3,
  //     ratings: [
  //       {
  //         id: 1,
  //         date: new Date('2026-01-10'),
  //         score: 5,
  //         comment: 'Un chef d\'œuvre de la littérature policière !',
  //         user: { id: 101, firstName: 'Marie', lastName: 'Curie', email: 'm@curie.com', role: 'USER' as RoleEnum }
  //       },
  //       {
  //         id: 2,
  //         date: new Date('2026-01-12'),
  //         score: 4,
  //         comment: 'Très bon livre, même si le début est un peu lent.',
  //         user: { id: 102, firstName: 'Jean', lastName: 'Dupont', email: 'j@dupont.com', role: 'USER' as RoleEnum }
  //       }
  //     ]
  //   })
  // }

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

  submitRating() {
    const book = this.book()
    if (!book || this.newScore() === 0) return

    this.isSubmitting.set(true)
    this.ratingSuccess.set(false)
    this.ratingError.set(false)

    this.bookService.addRating(book.id, this.newScore(), this.newComment).subscribe({
      next: () => {
        this.isSubmitting.set(false)
        this.ratingSuccess.set(true)
        this.newScore.set(0)
        this.newComment = ''
        this.loadRatings(Number(book.id))
      },
      error: (err) => {
        this.isSubmitting.set(false)
        this.ratingError.set(err.error?.message ?? 'Une erreur est survenue.')
      }
    })
  }
}