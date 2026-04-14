import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
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
 
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/api/auth/login`, { email, password }).pipe(
      tap((response) => {
        const userToStore: Partial<User> = {
          email,
          token: response.token,
        };
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        this.currentUserSignal.set(userToStore);
      })
    );
  }
 
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
  }
 
  register(userData: Registered): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/api/auth/register`, userData).pipe(
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