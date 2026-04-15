import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute, provideRouter, Router } from '@angular/router'
import { of } from 'rxjs'
import { vi } from 'vitest'
import { Home } from './home'
import { Author, Book, Category } from '../../app/interface'
import { BookService } from '../../app/services/book'
import { AuthorService } from '../../app/services/author'
import { CategoryService } from '../../app/services/category'

describe('Home', () => {
	let fixture: ComponentFixture<Home>
	let component: Home

	let routerSpy: Pick<Router, 'navigateByUrl'>
	let bookServiceSpy: Pick<BookService, 'getBooks' | 'searchBooks'>
	let authorServiceSpy: Pick<AuthorService, 'getAuthors'>
	let categoryServiceSpy: Pick<CategoryService, 'getCategories'>

	const authors: Author[] = [
		{ id: 1, firstName: 'Victor', lastName: 'Hugo' },
		{ id: 2, firstName: 'Isaac', lastName: 'Asimov' }
	]

	const categories: Category[] = [
		{ id: 10, name: 'Roman' },
		{ id: 20, name: 'Science Fiction' }
	]

	const books: Book[] = [
		{
			id: 100,
			title: 'Les Miserables',
			isbn: 'ISBN-100',
			author: [{ id: 1, firstName: 'Victor', lastName: 'Hugo' }],
			category: [{ id: 10, name: 'Roman' }],
			image: 'cover.jpg',
			date: '2024-01-01',
			isAvailable: true
		}
	]

	beforeEach(async () => {
		routerSpy = {
			navigateByUrl: vi.fn()
		}

		bookServiceSpy = {
			getBooks: vi.fn().mockReturnValue(of({ content: books, totalPages: 2 })),
			searchBooks: vi.fn().mockReturnValue(of({ content: books, totalPages: 3 }))
		}

		authorServiceSpy = {
			getAuthors: vi.fn().mockReturnValue(of(authors))
		}

		categoryServiceSpy = {
			getCategories: vi.fn().mockReturnValue(of(categories))
		}

		await TestBed.configureTestingModule({
			imports: [Home],
			providers: [
				provideRouter([]),
				{
					provide: ActivatedRoute,
					useValue: {
						snapshot: {
							url: [{ path: 'products' }, { path: 'roman' }]
						}
					}
				},
				{ provide: Router, useValue: routerSpy as Router },
				{ provide: BookService, useValue: bookServiceSpy as BookService },
				{ provide: AuthorService, useValue: authorServiceSpy as AuthorService },
				{ provide: CategoryService, useValue: categoryServiceSpy as CategoryService }
			]
		}).compileComponents()

		fixture = TestBed.createComponent(Home)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create and load filters then books', () => {
		expect(component).toBeTruthy()
		expect(authorServiceSpy.getAuthors).toHaveBeenCalled()
		expect(categoryServiceSpy.getCategories).toHaveBeenCalled()
		expect(bookServiceSpy.searchBooks).toHaveBeenCalled()
		expect(component.selectedCategoryIds()).toEqual([10])
		expect(component.products().length).toBe(1)
	})

	it('should execute search when filters are applied', () => {
		component.onSearchInput('Dune')
		component.onIsbnInput('ISBN-100')
		component.onDateChange('2024-01-01')
		component.onAvailabilityChange('true')
		component.selectedAuthorIds.set([1])
		component.selectedCategoryIds.set([10])
		component.openFilterModal()

		component.onSearch()

		expect(bookServiceSpy.searchBooks).toHaveBeenCalled()
		const payload = vi.mocked(bookServiceSpy.searchBooks).mock.calls.at(-1)?.[0]
		expect(payload).toMatchObject({
			title: 'Dune',
			isbn: 'ISBN-100',
			date: '2024-01-01',
			isAvailable: true,
			authors: [1],
			categoryList: [10],
			page: 0,
			size: 20,
			sort: 'title,asc'
		})
		expect(component.isFilterModalOpen()).toBe(false)
	})

	it('should reset filters and reload all books', () => {
		component.searchTerm.set('abc')
		component.selectedCategoryIds.set([10])

		component.resetFilters()

		expect(component.searchTerm()).toBe('')
		expect(component.selectedCategoryIds()).toEqual([])
		expect(component.currentPage()).toBe(1)
		expect(component.totalPages()).toBe(2)
		expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/products')
	})

	it('should update page with next, previous and goToPage', () => {
		const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)

		component.searchTerm.set('query')
		component.totalPages.set(3)
		component.currentPage.set(1)

		component.nextPage()
		expect(component.currentPage()).toBe(2)

		component.prevPage()
		expect(component.currentPage()).toBe(1)

		component.goToPage(3)
		expect(component.currentPage()).toBe(3)
		expect(scrollSpy).toHaveBeenCalled()

		scrollSpy.mockRestore()
	})
})
