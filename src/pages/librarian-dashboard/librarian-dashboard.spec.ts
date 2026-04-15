import { ComponentFixture, TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { vi } from 'vitest'
import { HttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { LibrarianDashboard } from './librarian-dashboard'

describe('LibrarianDashboard', () => {
	let fixture: ComponentFixture<LibrarianDashboard>
	let component: LibrarianDashboard
	let httpSpy: { get: ReturnType<typeof vi.fn> }

	beforeEach(async () => {
		httpSpy = {
			get: vi.fn((url: string) => {
				if (url.includes('/stats')) {
					return of({ totalBooks: 42, activeLoans: 12, overdueLoans: 3 })
				}
				if (url.includes('/overdue')) {
					return of([
						{
							loanId: 1,
							userId: 10,
							userFirstName: 'Alice',
							userLastName: 'Martin',
							bookTitle: 'Dune',
							returnDate: '2024-03-01',
							daysOverdue: 6
						}
					])
				}
				return of([{ bookId: 100, title: '1984', loanCount: 55 }])
			})
		}

		await TestBed.configureTestingModule({
			imports: [LibrarianDashboard],
			providers: [
				provideRouter([]),
				{ provide: HttpClient, useValue: httpSpy as unknown as HttpClient }
			]
		}).compileComponents()

		fixture = TestBed.createComponent(LibrarianDashboard)
		component = fixture.componentInstance
	})

	it('should create and load all dashboard data', () => {
		expect(component).toBeTruthy()

		component.loadData()

		expect(httpSpy.get).toHaveBeenCalledTimes(3)
		expect(component.stats().totalBooks).toBe(42)
		expect(component.overdues().length).toBe(1)
		expect(component.topBooks().length).toBe(1)
	})

	it('should not build chart when canvas is missing', () => {
		const getElementSpy = vi.spyOn(document, 'getElementById').mockReturnValue(null)

		component.ngAfterViewInit()

		expect(getElementSpy).toHaveBeenCalledWith('borrowChart')
		getElementSpy.mockRestore()
	})

	it('should trigger alert for relancer and gererRetour', () => {
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined)

		component.relancer(5)
		component.gererRetour(8)

		expect(alertSpy).toHaveBeenCalledTimes(2)
		expect(alertSpy).toHaveBeenCalledWith("Relance envoyée pour l'emprunt #5")
		expect(alertSpy).toHaveBeenCalledWith("Retour validé pour l'emprunt #8")

		alertSpy.mockRestore()
	})
})
