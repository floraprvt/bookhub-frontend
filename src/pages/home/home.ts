import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService } from '../../app/services/book';
import { ProductCardComponent } from '../../app/components/cards/cards';
import { Book } from '../../app/interface';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private bookService = inject(BookService)

  products = signal<Book[]>([])

  selectedCategory = signal<string>('all')
  currentPage = signal<number>(1)
  itemsPerPage = 20
  filteredProducts = computed(() => {
    const category = this.selectedCategory()
    if (category === 'all') {
      return this.products()
    }
    return this.products().filter(p => 
      p.category.some(c => c.name === category)
    )
  })

  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.itemsPerPage)
  })

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage
    const end = start + this.itemsPerPage
    return this.filteredProducts().slice(start, end)
  })

  ngOnInit() {
    const urlSegment = this.route.snapshot.url[1]?.path
    if (urlSegment) {
      this.selectedCategory.set(urlSegment)
    }

    this.bookService.getBooks().subscribe({
        next: ((value) => this.products.set(value.content)),
        error: ((error: any) => console.log(error))
      })
  }

  onCategoryChange(category: string) {
    this.selectedCategory.set(category)
    this.currentPage.set(1)

    const newUrl = category === 'all' ? '/products' : `/products/${category}`
    this.router.navigateByUrl(newUrl)
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
