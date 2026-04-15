import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { of } from 'rxjs'
import { Register } from './register'
import { AuthService } from '../../app/services/auth'

describe('Register', () => {
	let fixture: ComponentFixture<Register>
	let component: Register

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [Register],
			providers: [
				provideRouter([]),
				{
					provide: AuthService,
					useValue: { register: () => of({ token: 'abc' }) }
				}
			]
		}).compileComponents()

		fixture = TestBed.createComponent(Register)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
