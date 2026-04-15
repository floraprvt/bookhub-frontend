import { signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { of } from 'rxjs'
import { vi } from 'vitest'
import { CatalogManagement } from './catalog-management'
import { Author, Book, Category } from '../../app/interface'
import { BookService } from '../../app/services/book'
import { AuthorService } from '../../app/services/author'
import { CategoryService } from '../../app/services/category'
import { AuthService } from '../../app/services/auth'

describe('CatalogManagement', () => {
	let fixture: ComponentFixture<CatalogManagement>
	let component: CatalogManagement

	let bookServiceSpy: Pick<BookService, 'getBooks' | 'addBook' | 'updateBook' | 'deleteBook'>
	let authorServiceSpy: Pick<AuthorService, 'getAuthors'>
	let categoryServiceSpy: Pick<CategoryService, 'getCategories'>

	const authors: Author[] = [
		{ id: 1, firstName: 'Victor', lastName: 'Hugo' },
		{ id: 2, firstName: 'Jane', lastName: 'Austen' }
	]

	const categories: Category[] = [
		{ id: 10, name: 'Roman' },
		{ id: 20, name: 'Classique' }
	]

	const apiBooks: Book[] = [
		{
			id: 100,
			title: 'Les Miserables',
			isbn: 'ISBN-100',
			author: [{ id: 1, firstName: 'Victor', lastName: 'Hugo' }],
			category: [{ id: 10, name: 'Roman' }],
			image: 'cover.jpg',
			date: '2024-01-15T00:00:00.000Z',
			description: 'A classic novel',
			isAvailable: true,
			availableCopies: 2,
			totalCopies: 2
		}
	]

	beforeEach(async () => {
		bookServiceSpy = {
			getBooks: vi.fn().mockReturnValue(of({ content: apiBooks, totalPages: 1 })),
			addBook: vi.fn().mockReturnValue(of(apiBooks[0])),
			updateBook: vi.fn().mockReturnValue(of(apiBooks[0])),
			deleteBook: vi.fn().mockReturnValue(of(void 0))
		}

		authorServiceSpy = {
			getAuthors: vi.fn().mockReturnValue(of(authors))
		}

		categoryServiceSpy = {
			getCategories: vi.fn().mockReturnValue(of(categories))
		}

		await TestBed.configureTestingModule({
			imports: [CatalogManagement],
			providers: [
				provideRouter([]),
				{ provide: BookService, useValue: bookServiceSpy as BookService },
				{ provide: AuthorService, useValue: authorServiceSpy as AuthorService },
				{ provide: CategoryService, useValue: categoryServiceSpy as CategoryService },
				{ provide: AuthService, useValue: { isAdmin: signal(false) } }
			]
		}).compileComponents()

		fixture = TestBed.createComponent(CatalogManagement)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create and load initial data', () => {
		expect(component).toBeTruthy()
		expect(authorServiceSpy.getAuthors).toHaveBeenCalled()
		expect(categoryServiceSpy.getCategories).toHaveBeenCalled()
		expect(bookServiceSpy.getBooks).toHaveBeenCalledWith(0, 500, 'title,asc')

		expect(component.books().length).toBe(1)
		expect(component.books()[0].authors).toEqual(['Victor Hugo'])
		expect(component.books()[0].categories).toEqual(['Roman'])
	})

	it('should filter books by title, author, category or isbn', () => {
		component.searchQuery.set('victor')
		expect(component.filteredBooks().length).toBe(1)

		component.searchQuery.set('roman')
		expect(component.filteredBooks().length).toBe(1)

		component.searchQuery.set('isbn-100')
		expect(component.filteredBooks().length).toBe(1)

		component.searchQuery.set('not-found')
		expect(component.filteredBooks().length).toBe(0)
	})

	it('should open modal in create mode and reset form on addBook', () => {
		component.bookForm.title = 'Changed title'

		component.addBook()

		expect(component.modalMode()).toBe('create')
		expect(component.editingBookId()).toBeNull()
		expect(component.isModalOpen()).toBe(true)
		expect(component.bookForm.title).toBe('')
	})

	it('should open modal in edit mode and prefill form on editBook', () => {
		component.editBook(100)

		expect(component.modalMode()).toBe('edit')
		expect(component.editingBookId()).toBe(100)
		expect(component.isModalOpen()).toBe(true)
		expect(component.bookForm.title).toBe('Les Miserables')
		expect(component.bookForm.selectedAuthorIds).toEqual([1])
		expect(component.bookForm.selectedCategoryIds).toEqual([10])
	})

	it('should create a book when form is valid in create mode', () => {
		component.addBook()
		component.bookForm = {
			title: 'New Book',
			selectedAuthorIds: [1],
			selectedCategoryIds: [10],
			isbn: 'ISBN-NEW',
			description: 'Desc',
			image: 'img.jpg',
			date: '2025-02-01',
			isAvailable: true
		}

		component.saveBook()

		expect(bookServiceSpy.addBook).toHaveBeenCalled()
		expect(bookServiceSpy.updateBook).not.toHaveBeenCalled()
		const payload = vi.mocked(bookServiceSpy.addBook).mock.calls[0][0]
		expect(payload.title).toBe('New Book')
		expect(payload.author).toEqual([{ id: 1, firstName: 'Victor', lastName: 'Hugo' }])
		expect(payload.category).toEqual([{ id: 10, name: 'Roman' }])
		expect(component.isModalOpen()).toBe(false)
		expect(component.isSaving()).toBe(false)
	})

	it('should update a book when form is valid in edit mode', () => {
		component.editBook(100)
		component.bookForm.title = 'Updated title'

		component.saveBook()

		expect(bookServiceSpy.updateBook).toHaveBeenCalled()
		const payload = vi.mocked(bookServiceSpy.updateBook).mock.calls[0][0]
		expect(payload.id).toBe(100)
		expect(payload.title).toBe('Updated title')
	})

	it('should not save when form is invalid', () => {
		component.addBook()
		component.bookForm = {
			title: '   ',
			selectedAuthorIds: [],
			selectedCategoryIds: [],
			isbn: '   ',
			description: '',
			image: '',
			date: '',
			isAvailable: true
		}

		component.saveBook()

		expect(bookServiceSpy.addBook).not.toHaveBeenCalled()
		expect(bookServiceSpy.updateBook).not.toHaveBeenCalled()
	})

	it('should not delete an unavailable book', () => {
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined)
		const confirmSpy = vi.spyOn(window, 'confirm')

		component.deleteBook({
			id: 200,
			title: 'Unavailable',
			authors: ['Victor Hugo'],
			authorIds: [1],
			categories: ['Roman'],
			categoryIds: [10],
			isbn: 'ISBN-200',
			description: '',
			image: '',
			date: '2025-01-01',
			isAvailable: false
		})

		expect(alertSpy).toHaveBeenCalled()
		expect(confirmSpy).not.toHaveBeenCalled()
		expect(bookServiceSpy.deleteBook).not.toHaveBeenCalled()

		alertSpy.mockRestore()
		confirmSpy.mockRestore()
	})

	it('should delete a book after confirmation', () => {
		const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

		component.deleteBook(component.books()[0])

		expect(bookServiceSpy.deleteBook).toHaveBeenCalledWith(100)
		expect(bookServiceSpy.getBooks).toHaveBeenCalledTimes(2)

		confirmSpy.mockRestore()
	})
})
