import { Component, signal, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink, RouterLinkActive } from '@angular/router'

export interface BookCatalog {
  id: string
  title: string
  author: string
  isbn: string
  availableCopies: number
  totalCopies: number
  hasActiveBorrows: boolean
}

@Component({
  selector: 'app-catalog-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './catalog-management.html'
})
export class CatalogManagement implements OnInit {
  books = signal<BookCatalog[]>([])
  searchQuery = signal<string>('')
  librarianName = signal<string>('Ahmed')

  ngOnInit() {
    this.books.set([
      { id: '1', title: '1984', author: 'George Orwell', isbn: '978-0451524935', availableCopies: 0, totalCopies: 1, hasActiveBorrows: true },
      { id: '2', title: 'Le Seigneur des Anneaux', author: 'J.R.R. Tolkien', isbn: '978-2266286268', availableCopies: 0, totalCopies: 1, hasActiveBorrows: true },
      { id: '3', title: 'Dune', author: 'Frank Herbert', isbn: '978-2221246937', availableCopies: 1, totalCopies: 1, hasActiveBorrows: false }
    ])
  }

  deleteBook(book: BookCatalog) {
    if (book.hasActiveBorrows) {
      alert("Impossible de supprimer ce livre car des emprunts sont en cours")
      return
    }
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${book.title} ?`)) {
      this.books.update(books => books.filter(b => b.id !== book.id))
    }
  }

  editBook(id: string) {
    alert(`Ouverture du formulaire d'édition pour le livre ${id}`)
  }

  addBook() {
    alert("Ouverture du formulaire d'ajout d'un nouveau livre")
  }
}
