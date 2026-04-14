import { Component, computed, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../../app/components/cards/cards';

interface Product {
  title: string;
  autor: string;
  imageSrc: string;
  lien: string;
  alt: string;
  category: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  products = signal<Product[]>([
    { title: "Arsène lupin", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Plaquettes de frein 1", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 2", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 3", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 4", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 5", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 6", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 7", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 8", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Arsène lupin 2", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 3", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 4", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 5", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 6", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 7", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Plaquettes de frein 9", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 10", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 11", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Arsène lupin 8", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 9", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 10", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 11", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 12", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 13", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Plaquettes de frein 1", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 2", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 3", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 4", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 5", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 6", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 7", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 8", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Arsène lupin 2", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 3", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 4", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 5", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 6", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 7", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Plaquettes de frein 9", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 10", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Plaquettes de frein 11", autor: "roberto", imageSrc: "/assets/arsene.webp", lien: "", alt: "Frein", category: "freinage", isAvailable: false },
    { title: "Arsène lupin 8", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 9", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 10", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 11", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 12", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
    { title: "Arsène lupin 13", imageSrc: "/assets/arsene.webp", autor: "roberto", lien: "", alt: "Roman policier", category: "Roman policier", isAvailable: true },
  ])

  selectedCategory = signal<string>('all')
  currentPage = signal<number>(1)
  itemsPerPage = 20
  filteredProducts = computed(() => {
    const category = this.selectedCategory()
    if (category === 'all') {
      return this.products()
    }
    return this.products().filter(p => p.category === category)
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
