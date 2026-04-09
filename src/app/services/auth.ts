import { Injectable, signal, computed } from '@angular/core';
import { Registered, User } from '../models/user';


/**
 * Pour information : ce service utilise des signaux pour gérer l'état de l'utilisateur connecté.
 * La manipulation des storages (localStorage/sessionStorage) est faite de manière simple pour les besoins de ce TP,
 * mais en production, il faudrait gérer cela de manière plus sécurisée (ex: tokens JWT, cookies HttpOnly, etc.).
 */

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Signal pour gérer l'utilisateur connecté
  private currentUserSignal = signal<Partial<User> | null>(null)

  // Signal computed pour vérifier si l'utilisateur est connecté
  public isAuthenticated = computed(() => this.currentUserSignal() !== null)

  // Signal computed pour obtenir l'utilisateur actuel
  public currentUser = computed(() => this.currentUserSignal())

  constructor() {
    // Initialisation depuis le sessionStorage
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        this.currentUserSignal.set(user)
      } catch (error) {
        console.error("Erreur lors du parsing de l'utilisateur stocké:", error)
        localStorage.removeItem('currentUser')
      }
    }
  }

  login(email: string, password: string): Partial<User> {
    // Simulation d'une authentification
    const user: Partial<User> = {
      email,
      token: 'fake-jwt-token',
    }

    // Sauvegarde en sessionStorage
    localStorage.setItem('currentUser', JSON.stringify(user))

    // Mise à jour du signal
    this.currentUserSignal.set(user)

    return user
  }

  logout(): void {
    // Suppression de la session
    localStorage.removeItem('currentUser')

    // Mise à jour du signal
    this.currentUserSignal.set(null)
  }

  register(userData: Registered): boolean {
    const users = this.getStoredUsers()
    users.push({
      email: userData.email,
      password: userData.password,
      lastName: userData.lastName,
      firstName: userData.firstName,
      phone: userData.phone
    })
    localStorage.setItem('users', JSON.stringify(users))
    return true
  }

  private getStoredUsers(): Registered[] {
    const stored = localStorage.getItem('users')
    return stored ? JSON.parse(stored) : []
  }

  validateCredentials(email: string, password: string): boolean {
    const users = this.getStoredUsers()
    return users.some(
      (user) => user.email === email && user.password === password
    )
  }
}
