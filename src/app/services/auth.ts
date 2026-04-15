import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, tap } from 'rxjs';
import { Registered, User } from '../models/user';
 
const API_URL = 'http://localhost:8080';
 
interface LoginResponse {
  token: string;
}
 
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
 
  private currentUserSignal = signal<Partial<User> | null>(null);
 
  public isAuthenticated = computed(() => this.currentUserSignal() !== null);
  public currentUser = computed(() => this.currentUserSignal());
  public isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');
  public isLibrarian = computed(() => this.currentUserSignal()?.role === 'LIBRARIAN');
 
  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSignal.set(user);
      } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur stocké:", error);
        localStorage.removeItem('currentUser');
      }
    }
  }
 
  login(email: string, password: string): Observable<Partial<User>> {
    return this.http.post<LoginResponse>(`${API_URL}/api/auth/login`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('currentUser', JSON.stringify({ token: response.token }));
      }),
      switchMap((response) =>
        this.http.get<Partial<User>>(`${API_URL}/api/users/me`).pipe(
          tap((user) => {
            const userToStore: Partial<User> = { ...user, token: response.token };
            localStorage.setItem('currentUser', JSON.stringify(userToStore));
            this.currentUserSignal.set(userToStore);
          })
        )
      )
    );
  }
 
  updateProfile(data: { firstName: string; lastName: string; phone: string }): Observable<Partial<User>> {
    return this.http.put<Partial<User>>(`${API_URL}/api/users/me`, data).pipe(
      tap((updatedUser) => {
        const userToStore = { ...this.currentUserSignal(), ...updatedUser };
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        this.currentUserSignal.set(userToStore);
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${API_URL}/api/users/me/password`, { currentPassword, newPassword });
  }

  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${API_URL}/api/users/me`).pipe(
      tap(() => {
        localStorage.removeItem('currentUser');
        this.currentUserSignal.set(null);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
  }
 
  register(userData: Registered): Observable<LoginResponse> {
    const payload: Partial<Registered> = { ...userData };
    if (!payload.phone) delete payload.phone;
    if (!payload.password) delete payload.password;
    return this.http.post<LoginResponse>(`${API_URL}/api/auth/register`, payload).pipe(
      tap((response) => {
        const userToStore: Partial<User> = {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          token: response.token,
        };
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        this.currentUserSignal.set(userToStore);
      })
    );
  }
}