import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

  products = signal<Book[]>([
    { id: '1', title: "Arsène lupin", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '2', title: "Plaquettes de frein 1", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '3', title: "Plaquettes de frein 2", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '4', title: "Plaquettes de frein 3", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '5', title: "Plaquettes de frein 4", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '6', title: "Plaquettes de frein 5", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '7', title: "Plaquettes de frein 6", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '8', title: "Plaquettes de frein 7", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '9', title: "Plaquettes de frein 8", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '10', title: "Arsène lupin 2", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '11', title: "Arsène lupin 3", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '12', title: "Arsène lupin 4", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 5", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 6", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 7", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Plaquettes de frein 9", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '13', title: "Plaquettes de frein 10", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '13', title: "Plaquettes de frein 11", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '13', title: "Arsène lupin 8", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 9", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 10", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 11", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 12", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 13", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Plaquettes de frein 1", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '13', title: "Plaquettes de frein 2", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '13', title: "Plaquettes de frein 3", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '13', title: "Plaquettes de frein 4", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '13', title: "Plaquettes de frein 5", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '13', title: "Plaquettes de frein 6", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '13', title: "Plaquettes de frein 7", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '13', title: "Plaquettes de frein 8", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '13', title: "Arsène lupin 2", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 3", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 4", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 5", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 6", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 7", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Plaquettes de frein 9", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '13', title: "Plaquettes de frein 10", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '13', title: "Plaquettes de frein 11", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], image: "/assets/arsene.jpg", alt: "Frein", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: false },
    { id: '13', title: "Arsène lupin 8", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 9", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 10", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 11", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 12", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
    { id: '13', title: "Arsène lupin 13", image: "/assets/arsene.jpg", authors: [{ id: 1, firstName: 'Gaston', lastName: 'Leroux' }], alt: "Roman policier", categories:  [{ id:1, name: 'Roman Policier'}], isAvailable: true },
  ])

  selectedCategory = signal<string>('all')
  currentPage = signal<number>(1)
  itemsPerPage = 20
  filteredProducts = computed(() => {
    const category = this.selectedCategory()
    if (category === 'all') {
      return this.products()
    }
    return this.products().filter(p => 
      p.categories.some(c => c.name === category)
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
