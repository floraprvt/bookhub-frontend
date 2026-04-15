import { Component, signal, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Book } from '../../interface'
import { BookService } from '../../services/book'
import { AuthService } from '../../services/auth'

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
  private authService = inject(AuthService)
  
  book = signal<Book | null>(null)
  ratings = signal<any[]>([])
  starsArray = [1, 2, 3, 4, 5]

  currentUser = this.authService.currentUser
  isAdmin = this.authService.isAdmin
  isLibrarian = this.authService.isLibrarian

  newScore = signal(0)
  hoverScore = signal(0)
  newComment = ''
  isSubmitting = signal(false)
  ratingSuccess = signal(false)
  ratingError = signal<string | false>(false)

  editingRatingId = signal<number | string | null>(null)
  editScore = signal(0)
  editHoverScore = signal(0)
  editComment = ''
  isEditing = signal(false)

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

  startEdit(review: any) {
    this.editingRatingId.set(review.id)
    this.editScore.set(review.score)
    this.editComment = review.comment ?? ''
  }

  cancelEdit() {
    this.editingRatingId.set(null)
  }

  deleteRating(reviewId: number | string) {
    const book = this.book()
    if (!book) return
    this.bookService.deleteRating(reviewId).subscribe({
      next: () => this.loadRatings(Number(book.id)),
      error: (err) => alert(err.error?.message ?? 'Une erreur est survenue.')
    })
  }

  submitEdit() {
    const id = this.editingRatingId()
    const book = this.book()
    if (!id || !book) return

    this.isEditing.set(true)
    const userId = this.authService.currentUser()?.id!
    this.bookService.updateRating(id, this.editScore(), this.editComment, userId).subscribe({
      next: () => {
        this.isEditing.set(false)
        this.editingRatingId.set(null)
        this.loadRatings(Number(book.id))
      },
      error: (err) => {
        this.isEditing.set(false)
        alert(err.error?.message ?? 'Une erreur est survenue.')
      }
    })
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