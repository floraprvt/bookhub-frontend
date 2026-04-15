import { ComponentFixture, TestBed } from '@angular/core/testing'
import { of, throwError } from 'rxjs'
import { vi } from 'vitest'
import { HttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { Loan } from '../../app/interface'
import { ReturnsManagement } from './returns-management'

describe('ReturnsManagement', () => {
	let fixture: ComponentFixture<ReturnsManagement>
	let component: ReturnsManagement
	let httpSpy: Pick<HttpClient, 'get' | 'put'>

	const loans: Loan[] = [
		{
			id: 1,
			loanDate: '2024-01-01',
			returnDate: '2024-01-10',
			isReturned: false,
			userId: 10,
			bookId: 100,
			firstName: 'Alice',
			lastName: 'Martin',
			bookTitle: 'Dune',
			late: false
		},
		{
			id: 2,
			loanDate: '2024-01-03',
			returnDate: '2024-01-12',
			isReturned: true,
			userId: 11,
			bookId: 101,
			firstName: 'Bob',
			lastName: 'Durand',
			bookTitle: '1984',
			late: true
		}
	]

	beforeEach(async () => {
		httpSpy = {
			get: vi.fn().mockReturnValue(of(loans)),
			put: vi.fn().mockReturnValue(of(void 0))
		}

		await TestBed.configureTestingModule({
			imports: [ReturnsManagement],
			providers: [
				provideRouter([]),
				{ provide: HttpClient, useValue: httpSpy as HttpClient }
			]
		}).compileComponents()

		fixture = TestBed.createComponent(ReturnsManagement)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create and load only active loans', () => {
		expect(component).toBeTruthy()
		expect(httpSpy.get).toHaveBeenCalledTimes(1)
		expect(component.activeLoans().length).toBe(1)
		expect(component.activeLoans()[0].id).toBe(1)
	})

	it('should process return and remove returned loan from state', () => {
		component.processReturn(1)

		expect(httpSpy.put).toHaveBeenCalledWith('http://localhost:8080/api/loans/1/return', {})
		expect(component.activeLoans().length).toBe(0)
	})

	it('should alert when return processing fails', () => {
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined)
		vi.mocked(httpSpy.put).mockReturnValueOnce(
			throwError(() => ({ error: { message: 'Impossible de valider le retour' } }))
		)

		component.processReturn(1)

		expect(alertSpy).toHaveBeenCalledWith('Impossible de valider le retour')
		alertSpy.mockRestore()
	})
})
