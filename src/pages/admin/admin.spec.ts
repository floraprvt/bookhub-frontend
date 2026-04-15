import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { of } from 'rxjs'
import { vi } from 'vitest'
import { HttpClient } from '@angular/common/http'
import { AdminDashboard } from './admin'
import { RoleEnum, User } from '../../app/interface'

describe('AdminDashboard', () => {
	let fixture: ComponentFixture<AdminDashboard>
	let component: AdminDashboard

	let httpSpy: Pick<HttpClient, 'get'>
	let routerSpy: Pick<Router, 'navigate'>

	const users: User[] = [
		{
			id: 1,
			firstName: 'Alice',
			lastName: 'Martin',
			email: 'alice@example.com',
			phone: '0102030405',
			role: RoleEnum.USER
		},
		{
			id: 2,
			firstName: 'Bob',
			lastName: 'Durand',
			email: 'bob@example.com',
			phone: '0605040302',
			role: RoleEnum.ADMIN
		}
	]

	beforeEach(async () => {
		httpSpy = {
			get: vi.fn().mockReturnValue(of({ content: users }))
		}

		routerSpy = {
			navigate: vi.fn()
		}

		await TestBed.configureTestingModule({
			imports: [AdminDashboard],
			providers: [
				{ provide: HttpClient, useValue: httpSpy as HttpClient },
				{ provide: Router, useValue: routerSpy as Router }
			]
		}).compileComponents()

		fixture = TestBed.createComponent(AdminDashboard)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create and load users on init', () => {
		expect(component).toBeTruthy()
		expect(httpSpy.get).toHaveBeenCalledTimes(1)
		expect(component.users().length).toBe(2)
	})

	it('should filter users by first name, last name and email', () => {
		component.searchQuery = 'alice'
		expect(component.filteredUsers().length).toBe(1)

		component.searchQuery = 'durand'
		expect(component.filteredUsers().length).toBe(1)

		component.searchQuery = 'bob@example.com'
		expect(component.filteredUsers().length).toBe(1)

		component.searchQuery = 'not-found'
		expect(component.filteredUsers().length).toBe(0)
	})

	it('should navigate to edit user page', () => {
		component.editUser(2)
		expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/edit-user', 2])
	})
})
