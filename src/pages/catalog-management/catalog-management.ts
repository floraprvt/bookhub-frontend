import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { Author, Book, BookCatalog, BookFormData, Category } from '../../app/interface'
import { BookService } from '../../app/services/book'
import { AuthorService } from '../../app/services/author'
import { CategoryService } from '../../app/services/category'

@Component({
  selector: 'app-catalog-management',
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './catalog-management.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogManagement implements OnInit {
  private readonly bookService = inject(BookService)
  private readonly authorService = inject(AuthorService)
  private readonly categoryService = inject(CategoryService)

  books = signal<BookCatalog[]>([])
  authors = signal<Author[]>([])
  categories = signal<Category[]>([])
  searchQuery = signal<string>('')
  librarianName = signal<string>('Ahmed')
  isModalOpen = signal<boolean>(false)
  modalMode = signal<'create' | 'edit'>('create')
  editingBookId = signal<string | number | null>(null)
  isSaving = signal<boolean>(false)
  loadError = signal<string>('')
  bookForm: BookFormData = this.createEmptyBookForm()

  filteredBooks = computed(() => {
    const query = this.searchQuery().trim().toLowerCase()
    const allBooks = this.books()

    if (!query) {
      return allBooks
    }

    return allBooks.filter(book => {
      return (
        book.title.toLowerCase().includes(query)
        || this.getAuthorsDisplay(book.authors).toLowerCase().includes(query)
        || this.getCategoriesDisplay(book.categories).toLowerCase().includes(query)
        || book.isbn.toLowerCase().includes(query)
      )
    })
  })

  ngOnInit() {
    this.loadAuthors()
    this.loadCategories()
    this.loadBooks()
  }

  deleteBook(book: BookCatalog) {
    if (book.isAvailable === false) {
      alert("Impossible de supprimer ce livre car des emprunts sont en cours")
      return
    }
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${book.title} ?`)) {
      const bookId = Number(book.id)
      this.bookService.deleteBook(bookId).subscribe({
        next: () => {
          this.loadBooks()
        },
        error: (error: unknown) => {
          console.error(error)
          alert("Une erreur est survenue lors de la suppression du livre.")
        }
      })
    }
  }

  editBook(id: string | number) {
    const bookToEdit = this.books().find(book => book.id === id)
    if (!bookToEdit) {
      return
    }

    this.modalMode.set('edit')
    this.editingBookId.set(id)
    this.bookForm = {
      title: bookToEdit.title,
      selectedAuthorIds: bookToEdit.authorIds,
      selectedCategoryIds: bookToEdit.categoryIds,
      isbn: bookToEdit.isbn,
      description: bookToEdit.description,
      image: bookToEdit.image,
      date: bookToEdit.date,
      isAvailable: bookToEdit.isAvailable
    }
    this.isModalOpen.set(true)
  }

  addBook() {
    this.modalMode.set('create')
    this.editingBookId.set(null)
    this.bookForm = this.createEmptyBookForm()
    this.isModalOpen.set(true)
  }

  closeModal() {
    this.isModalOpen.set(false)
  }

  saveBook() {
    const title = this.bookForm.title.trim()
    const isbn = this.bookForm.isbn.trim()
    const description = this.bookForm.description.trim()
    const image = this.bookForm.image.trim()
    const date = this.bookForm.date.trim()
    const selectedAuthorIds = this.bookForm.selectedAuthorIds
    const selectedCategoryIds = this.bookForm.selectedCategoryIds

    if (!title || selectedAuthorIds.length === 0 || selectedCategoryIds.length === 0 || !isbn) {
      return
    }

    if (this.bookForm.isAvailable === false) {
      return
    }

    const payload = this.toApiBookPayload(title, selectedAuthorIds, selectedCategoryIds, isbn, description, image, date)
    this.isSaving.set(true)

    if (this.modalMode() === 'create') {
      this.bookService.addBook(payload).subscribe({
        next: () => {
          this.loadBooks()
          this.closeModal()
          this.isSaving.set(false)
        },
        error: (error: unknown) => {
          console.error(error)
          this.isSaving.set(false)
        }
      })
    } else {
      const editingBookId = this.editingBookId()
      if (!editingBookId) {
        this.isSaving.set(false)
        return
      }

      this.bookService.updateBook(payload).subscribe({
        next: () => {
          this.loadBooks()
          this.closeModal()
          this.isSaving.set(false)
        },
        error: (error: unknown) => {
          console.error(error)
          this.isSaving.set(false)
        }
      })
    }
  }

  private createEmptyBookForm(): BookFormData {
    return {
      title: '',
      selectedAuthorIds: [],
      selectedCategoryIds: [],
      isbn: '',
      description: '',
      image: '',
      date: '',
      isAvailable: true
    }
  }

  private loadBooks() {
    this.loadError.set('')
    this.bookService.getBooks().subscribe({
      next: (response) => {
        this.books.set(response.content.map(book => this.toCatalogBook(book)))
      },
      error: (error: unknown) => {
        console.error(error)
        this.loadError.set('Impossible de charger le catalogue pour le moment.')
      }
    })
  }

  private loadAuthors() {
    this.authorService.getAuthors().subscribe({
      next: (authors) => {
        this.authors.set(authors)
      },
      error: (error: unknown) => {
        console.error(error)
      }
    })
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories)
      },
      error: (error: unknown) => {
        console.error(error)
      }
    })
  }

  private toCatalogBook(book: Book): BookCatalog {
    const availableCopies = book.availableCopies ?? 0
    const totalCopies = book.totalCopies ?? 0
    const authors = (book.author ?? [])
      .map(currentAuthor => `${currentAuthor.firstName} ${currentAuthor.lastName}`.trim())
      .filter(authorName => authorName.length > 0)
    const authorIds = (book.author ?? []).map(author => author.id)
    const categories = (book.category ?? []).map(category => category.name)
    const categoryIds = (book.category ?? []).map(category => category.id)

    return {
      id: book.id,
      title: book.title,
      authors: authors.length > 0 ? authors : ['Auteur inconnu'],
      authorIds,
      categories: categories.length > 0 ? categories : ['Categorie inconnue'],
      categoryIds,
      isbn: book.isbn ?? '',
      description: book.description ?? '',
      image: book.image ?? '',
      date: this.toDateInputValue(book.date),
      isAvailable: book.isAvailable,
    }
  }

  private toApiBookPayload(title: string, selectedAuthorIds: Array<string | number>, selectedCategoryIds: Array<string | number>, isbn: string, description: string, image: string, date: string): Partial<Book> {
    const book = {
      title,
      isbn,
      description,
      author: this.toApiAuthors(selectedAuthorIds),
      category: this.toApiCategories(selectedCategoryIds),
      image,
      date,
      isAvailable: this.bookForm.isAvailable,
    }
    
    if (this.editingBookId()) {
      return {
        ...book,
        id: this.editingBookId()!
      }
    }

    return book;
  }

  getAuthorsDisplay(authors: string[]): string {
    return authors.join(', ')
  }

  getAuthorFullName(author: Author): string {
    return `${author.firstName} ${author.lastName}`.trim()
  }

  getCategoriesDisplay(categories: string[]): string {
    return categories.join(', ')
  }

  private toApiAuthors(selectedAuthorIds: Array<string | number>): Author[] {
    return selectedAuthorIds
      .map(selectedAuthorId => this.authors().find(author => author.id === selectedAuthorId))
      .filter((author): author is Author => !!author)
  }

  private toApiCategories(selectedCategoryIds: Array<string | number>): Category[] {
    return selectedCategoryIds
      .map(selectedCategoryId => this.categories().find(category => category.id === selectedCategoryId))
      .filter((category): category is Category => !!category)
  }

  private toDateInputValue(value: Date | string | undefined): string {
    if (!value) {
      return ''
    }

    const dateString = typeof value === 'string' ? value : value.toISOString()
    return dateString.slice(0, 10)
  }
}
