import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter, Router } from '@angular/router'
import { of, throwError } from 'rxjs'
import { vi } from 'vitest'
import { Login } from './login'
import { AuthService } from '../../app/services/auth'

describe('Login', () => {
	let fixture: ComponentFixture<Login>
	let component: Login
	let router: Router

	let authServiceSpy: Pick<AuthService, 'login'>

	beforeEach(async () => {
		authServiceSpy = {
			login: vi.fn().mockReturnValue(of({ token: 'abc' }))
		}

		await TestBed.configureTestingModule({
			imports: [Login],
			providers: [
				provideRouter([]),
				{ provide: AuthService, useValue: authServiceSpy as AuthService }
			]
		}).compileComponents()

		router = TestBed.inject(Router)
		vi.spyOn(router, 'navigate').mockResolvedValue(true)

		fixture = TestBed.createComponent(Login)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})

	it('should not submit when form is invalid', () => {
		component.onSubmit({ valid: false })
		expect(authServiceSpy.login).not.toHaveBeenCalled()
	})

	it('should navigate to profile on successful login', () => {
		component.user.email = 'user@example.com'
		component.user.password = 'secret'

		component.onSubmit({ valid: true })

		expect(authServiceSpy.login).toHaveBeenCalledWith('user@example.com', 'secret')
		expect(router.navigate).toHaveBeenCalledWith(['/profil'])
		expect(component.errorMessage()).toBeNull()
	})

	it('should set unauthorized error message on 401', () => {
		vi.mocked(authServiceSpy.login).mockReturnValueOnce(
			throwError(() => ({ status: 401 }))
		)

		component.onSubmit({ valid: true })

		expect(component.isLoading()).toBe(false)
		expect(component.errorMessage()).toBe('Email ou mot de passe incorrect')
	})

	it('should set backend validation message when backend returns object', () => {
		vi.mocked(authServiceSpy.login).mockReturnValueOnce(
			throwError(() => ({
				status: 400,
				error: {
					email: 'Email invalide',
					password: 'Mot de passe invalide'
				}
			}))
		)

		component.onSubmit({ valid: true })

		expect(component.errorMessage()).toBe('Email invalide | Mot de passe invalide')
	})

	it('should set generic message on unknown error', () => {
		vi.mocked(authServiceSpy.login).mockReturnValueOnce(
			throwError(() => ({ status: 500 }))
		)

		component.onSubmit({ valid: true })

		expect(component.errorMessage()).toBe('Une erreur est survenue, réessayez plus tard')
	})
})
