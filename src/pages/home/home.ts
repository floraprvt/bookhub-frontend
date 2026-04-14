import { ChangeDetectionStrategy, Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../../app/services/book';
import { ProductCardComponent } from '../../app/components/cards/cards';
import { AuthorService } from '../../app/services/author';
import { CategoryService } from '../../app/services/category';
import { Author, Book, BookSearchParams, Category } from '../../app/interface';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-home',
  imports: [ProductCardComponent],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly bookService = inject(BookService)
  private readonly authorService = inject(AuthorService)
  private readonly categoryService = inject(CategoryService)

  products = signal<Book[]>([])
  authors = signal<Author[]>([])
  categories = signal<Category[]>([])
  searchTerm = signal<string>('')
  isbnTerm = signal<string>('')
  selectedAuthorIds = signal<number[]>([])
  selectedCategoryIds = signal<number[]>([])
  initialCategoryFromRoute = signal<string>('')
  publishedDate = signal<string>('')
  selectedAvailability = signal<string>('all')
  isFilterModalOpen = signal<boolean>(false)
  currentPage = signal<number>(1)
  itemsPerPage = 20
  sortOrder = 'title,asc'
  totalPages = signal<number>(0)
  filteredProducts = computed(() => this.products())

  paginatedProducts = computed(() => {
    return this.filteredProducts()
  })

  ngOnInit() {
    const urlSegment = this.route.snapshot.url[1]?.path
    if (urlSegment) {
      this.initialCategoryFromRoute.set(urlSegment)
    }

    this.loadFiltersAndBooks()
  }

  private loadFiltersAndBooks() {
    forkJoin({
      authors: this.authorService.getAuthors(),
      categories: this.categoryService.getCategories()
    }).subscribe({
      next: ({ authors, categories }) => {
        this.authors.set(authors)
        this.categories.set(categories)
        this.applyRouteCategorySelection()
        this.executeSearch()
      },
      error: (error: unknown) => {
        console.error(error)
        this.loadAllBooks()
      }
    })
  }

  private loadAllBooks() {
    const currentBackendPage = this.currentPage() - 1
    this.bookService.getBooks(currentBackendPage, this.itemsPerPage, this.sortOrder).subscribe({
      next: value => {
        this.products.set(value.content)
        this.totalPages.set(Math.max(value.totalPages ?? 0, 0))
      },
      error: (error: unknown) => console.error(error)
    })
  }

  onSearchInput(value: string) {
    this.searchTerm.set(value)
  }

  onSearch() {
    this.currentPage.set(1)
    this.executeSearch()
    this.closeFilterModal()
  }

  openFilterModal() {
    this.isFilterModalOpen.set(true)
  }

  closeFilterModal() {
    this.isFilterModalOpen.set(false)
  }

  onCategorySelectionChange(event: Event) {
    const selectedIds = this.extractSelectedNumericValues(event)
    this.selectedCategoryIds.set(selectedIds)
  }

  onAuthorSelectionChange(event: Event) {
    const selectedIds = this.extractSelectedNumericValues(event)
    this.selectedAuthorIds.set(selectedIds)
  }

  onDateChange(date: string) {
    this.publishedDate.set(date)
  }

  onAvailabilityChange(value: string) {
    this.selectedAvailability.set(value)
  }

  onIsbnInput(value: string) {
    this.isbnTerm.set(value)
  }

  resetFilters() {
    this.searchTerm.set('')
    this.isbnTerm.set('')
    this.selectedCategoryIds.set([])
    this.selectedAuthorIds.set([])
    this.publishedDate.set('')
    this.selectedAvailability.set('all')
    this.currentPage.set(1)
    this.totalPages.set(0)
    this.router.navigateByUrl('/products')
    this.loadAllBooks()
    this.closeFilterModal()
  }

  getAuthorDisplayName(author: Author): string {
    return `${author.firstName} ${author.lastName}`.trim()
  }

  isCategorySelected(categoryId: string | number): boolean {
    const id = Number(categoryId)
    return Number.isFinite(id) && this.selectedCategoryIds().includes(id)
  }

  isAuthorSelected(authorId: string | number): boolean {
    const id = Number(authorId)
    return Number.isFinite(id) && this.selectedAuthorIds().includes(id)
  }

  private applyRouteCategorySelection() {
    const categoryName = this.initialCategoryFromRoute().trim().toLowerCase()
    if (!categoryName) {
      return
    }

    const category = this.categories().find(currentCategory => currentCategory.name.trim().toLowerCase() === categoryName)
    if (!category) {
      return
    }

    const id = Number(category.id)
    if (Number.isFinite(id)) {
      this.selectedCategoryIds.set([id])
    }
  }

  private extractSelectedNumericValues(event: Event): number[] {
    const selectElement = event.target as HTMLSelectElement | null
    if (!selectElement) {
      return []
    }

    return Array.from(selectElement.selectedOptions)
      .map(option => Number(option.value))
      .filter(value => Number.isFinite(value))
  }

  private executeSearch() {
    const title = this.searchTerm().trim()
    const isbn = this.isbnTerm().trim()
    const selectedAuthorIds = this.selectedAuthorIds()
    const selectedCategoryIds = this.selectedCategoryIds()
    const date = this.publishedDate().trim()
    const selectedAvailability = this.selectedAvailability()

    const search: BookSearchParams = {}

    if (title) {
      search.title = title
    }

    if (isbn) {
      search.isbn = isbn
    }

    if (date) {
      search.date = date
    }

    if (selectedAvailability === 'true' || selectedAvailability === 'false') {
      search.isAvailable = selectedAvailability === 'true'
    }

    if (selectedCategoryIds.length > 0) {
      search.categoryList = selectedCategoryIds
    }

    if (selectedAuthorIds.length > 0) {
      search.authors = selectedAuthorIds
    }

    const hasFilters = Boolean(
      title
      || isbn
      || date
      || selectedAvailability === 'true'
      || selectedAvailability === 'false'
      || selectedCategoryIds.length > 0
      || selectedAuthorIds.length > 0
    )

    if (!hasFilters) {
      this.loadAllBooks()
      return
    }

    search.page = this.currentPage() - 1
    search.size = this.itemsPerPage
    search.sort = this.sortOrder

    this.bookService.searchBooks(search).subscribe({
      next: value => {
        this.products.set(value.content)
        this.totalPages.set(Math.max(value.totalPages ?? 0, 0))
      },
      error: (error: unknown) => console.error(error)
    })
  }

  visiblePages = computed(() => {
    const total = this.totalPages()
    const current = this.currentPage()
    const maxVisible = 5

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    let start = Math.max(1, current - 2)
    let end = Math.min(total, current + 2)

    if (current <= 3) {
      start = 1
      end = maxVisible
    } else if (current >= total - 2) {
      start = total - maxVisible + 1
      end = total
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  })

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page)
      this.executeSearch()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1)
      this.executeSearch()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1)
      this.executeSearch()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
