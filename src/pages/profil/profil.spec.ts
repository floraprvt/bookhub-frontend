import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter, Router } from '@angular/router'
import { of, throwError } from 'rxjs'
import { vi } from 'vitest'
import { Profil } from './profil'
import { AuthService } from '../../app/services/auth'

describe('Profil', () => {
	let fixture: ComponentFixture<Profil>
	let component: Profil

	let authServiceSpy: {
		currentUser: ReturnType<typeof vi.fn>
		updateProfile: ReturnType<typeof vi.fn>
		changePassword: ReturnType<typeof vi.fn>
		deleteAccount: ReturnType<typeof vi.fn>
		logout: ReturnType<typeof vi.fn>
	}
	let routerSpy: Pick<Router, 'navigate'>

	beforeEach(async () => {
		authServiceSpy = {
			currentUser: vi.fn().mockReturnValue({
				firstName: 'Alice',
				lastName: 'Martin',
				email: 'alice@example.com',
				phone: '0102030405'
			}),
			updateProfile: vi.fn().mockReturnValue(of({})),
			changePassword: vi.fn().mockReturnValue(of(void 0)),
			deleteAccount: vi.fn().mockReturnValue(of(void 0)),
			logout: vi.fn()
		}

		routerSpy = {
			navigate: vi.fn()
		}

		await TestBed.configureTestingModule({
			imports: [Profil],
			providers: [
				provideRouter([]),
				{ provide: AuthService, useValue: authServiceSpy as unknown as AuthService },
				{ provide: Router, useValue: routerSpy as Router }
			]
		}).compileComponents()

		fixture = TestBed.createComponent(Profil)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create and load user data with mock books', () => {
		expect(component).toBeTruthy()
		expect(component.user().firstName).toBe('Alice')
		expect(component.borrows().length).toBeGreaterThan(0)
		expect(component.reservations().length).toBeGreaterThan(0)
		expect(component.history().length).toBeGreaterThan(0)
	})

	it('should update profile successfully', () => {
		component.updateProfile()

		expect(authServiceSpy.updateProfile).toHaveBeenCalled()
		expect(component.isUpdating()).toBe(false)
		expect(component.updateSuccess()).toBe(true)
		expect(component.updateError()).toBe(false)
	})

	it('should map profile update backend errors', () => {
		vi.mocked(authServiceSpy.updateProfile).mockReturnValueOnce(
			throwError(() => ({ error: { firstName: 'trop court', phone: 'invalide' } }))
		)

		component.updateProfile()

		expect(component.isUpdating()).toBe(false)
		expect(component.updateError()).toBe('Prénom : trop court | Téléphone : invalide')
	})

	it('should reject password change when confirmation does not match', () => {
		component.newPassword = 'secret1'
		component.confirmPassword = 'secret2'

		component.changePassword()

		expect(authServiceSpy.changePassword).not.toHaveBeenCalled()
		expect(component.passwordError()).toBe('Les mots de passe ne correspondent pas.')
	})

	it('should change password on success and clear fields', () => {
		component.currentPassword = 'oldpass'
		component.newPassword = 'newpass'
		component.confirmPassword = 'newpass'

		component.changePassword()

		expect(authServiceSpy.changePassword).toHaveBeenCalledWith('oldpass', 'newpass')
		expect(component.isChangingPassword()).toBe(false)
		expect(component.passwordSuccess()).toBe(true)
		expect(component.currentPassword).toBe('')
		expect(component.newPassword).toBe('')
		expect(component.confirmPassword).toBe('')
	})

	it('should not delete account when confirmation is canceled', () => {
		const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

		component.deleteAccount()

		expect(authServiceSpy.deleteAccount).not.toHaveBeenCalled()
		confirmSpy.mockRestore()
	})

	it('should delete account and navigate to login', () => {
		const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

		component.deleteAccount()

		expect(authServiceSpy.deleteAccount).toHaveBeenCalled()
		expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'])
		confirmSpy.mockRestore()
	})

	it('should cancel reservation, rate history book and logout', () => {
		const reservationId = component.reservations()[0].id
		const historyId = component.history()[0].id

		component.cancelReservation(reservationId)
		component.rateBook(historyId, 5)
		component.logout()

		expect(component.reservations().find(r => r.id === reservationId)).toBeUndefined()
		expect(component.history().find(h => h.id === historyId)?.rating).toBe(5)
		expect(authServiceSpy.logout).toHaveBeenCalled()
		expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'])
	})
})
